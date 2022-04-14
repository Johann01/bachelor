""" Module for model interpretation. """


import yaml
import argparse
import numpy as np
import pandas as pd
from pathlib import Path
import shap
import torch
from torch.utils.data import DataLoader
from train import TimeSeriesDataset, TSModel

import preprocess
import lime
import lime.lime_tabular


with open("../model/params.yaml", "r") as params_file:
    params = yaml.safe_load(params_file)

data_dir = params["data_dir"]
model_dir = params["model_dir"]


def prepare_data(background_data_size, test_sample_size, sequence_length):
    # load data
    train_df = preprocess.load_data("train.csv")
    test_df = preprocess.load_data("test.csv")
    label_name = params["label_name"]

    # load trained model
    model = TSModel(train_df.shape[1])

    model.load_state_dict(torch.load(Path(model_dir, "model.pt")))
    model.eval()

    # get background dataset
    train_dataset = TimeSeriesDataset(np.array(train_df), np.array(train_df[label_name]), seq_len=sequence_length)
    train_loader = DataLoader(train_dataset, batch_size=background_data_size, shuffle=False)
    background_data, _ = next(iter(train_loader))

    # get test data samples on which to explain the model’s output

    test_dataset = TimeSeriesDataset(np.array(test_df), np.array(test_df[label_name]), seq_len=sequence_length)

    test_loader = DataLoader(test_dataset, batch_size=test_sample_size, shuffle=False)

    test_sample_data, _ = next(iter(test_loader))
    return model, background_data, test_sample_data, test_df.columns.values.tolist()


def get_important_features_shapley(background_data_size, test_sample_size, sequence_length):
    model, background_data, test_sample_data, _ = prepare_data(background_data_size, test_sample_size, sequence_length)

    # integrate out feature importances based on background dataset
    e = shap.DeepExplainer(model, torch.Tensor(np.array(background_data)))

    print(np.array(background_data)[0])
    # explain the model's outputs on some data samples
    shap_values = e.shap_values(torch.Tensor(np.array(test_sample_data)))
    print(shap_values.shape)
    shap_values = np.mean(shap_values, axis=0)
    print(shap_values.shape)

    # save output
    df_shap = pd.DataFrame(shap_values)
    df_shap.columns = [
        "Close",
        "Volume",
        "High_Low_Pct",
        "Open_Close_Pct",
        "Day_Of_Week",
        "Month_Of_Year",
        "Quarter_Of_Year",
    ]

    preprocess.save_data(df_shap, "shap_values.csv")

    return shap_values, e


def get_important_features_lime(background_data_size, test_sample_size, sequence_length):
    (model, background_data, test_sample_data, features) = prepare_data(
        background_data_size, test_sample_size, sequence_length
    )

    num_features_x, num_features_y, num_features_z = np.array(test_sample_data).shape

    # integrate out feature importances based on background dataset
    e = lime.lime_tabular.RecurrentTabularExplainer(
        np.array(background_data), feature_names=features, mode="regression", verbose=True
    )

    # print(background_data[0])
    # print(np.array(test_sample_data)[-1])

    exp = e.explain_instance(np.array(test_sample_data)[0], model.predict, num_features=num_features_y * num_features_z)

    # exp.show_in_notebook(show_table=True)

    # save output
    # pd.DataFrame(shap_values).to_csv(Path(data_dir, "shap_values.csv"), index=False)

    return exp, e


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--background-data-size", type=int, default=params["background_data_size"])
    parser.add_argument("--test-sample-size", type=int, default=params["test_sample_size"])
    parser.add_argument("--sequence-length", type=int, default=params["sequence_length"])
    args = parser.parse_args()

    print("Getting important features...")
    get_important_features_shapley(background_data_size, test_sample_size, sequence_length)(
        args.background_data_size, args.test_sample_size, args.sequence_length
    )
    print("Completed.")
