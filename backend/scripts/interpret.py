""" Module for model interpretation. """


import yaml
import joblib
import argparse
import numpy as np
import pandas as pd
from pathlib import Path
import shap
import torch
from torch.utils.data import DataLoader
from train import TimeSeriesDataset, TSModel
from captum.attr import KernelShap

import preprocess
import inference


with open("../model/params.yaml", "r") as params_file:
    params = yaml.safe_load(params_file)

data_dir = params["data_dir"]
model_dir = params["model_dir"]


def prepare_data(background_data_size, test_sample_size, sequence_length):

    # load data
    train_df = preprocess.load_data("train.csv")
    test_df = preprocess.load_data("test.csv")

    test_df = test_df[
        ["Close", "Volume", "High_Low_Pct", "Open_Close_Pct", "Day_Of_Week", "Month_Of_Year", "Quarter_Of_Year"]
    ]

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


def get_important_features_shapley(start, end, background_data_size, test_sample_size, sequence_length):

    model, background_data, test_sample_data, _ = prepare_data(background_data_size, test_sample_size, sequence_length)
    print("Base:", background_data.shape)
    print("Test:", test_sample_data.shape)

    # integrate out feature importances based on background dataset
    e = shap.DeepExplainer(model, torch.Tensor(np.array(background_data)))

    # explain the model's outputs on some data samples
    shap_values = e.shap_values(torch.Tensor(np.array(test_sample_data)))

    df_clean = preprocess.load_data("df_clean.csv")
    for x in range(start, end):
        date = df_clean["Date"][x]
        df_shap = pd.DataFrame(shap_values[x - start])
        df_shap.columns = [
            "Close",
            "Volume",
            "High_Low_Pct",
            "Open_Close_Pct",
            "Day_Of_Week",
            "Month_Of_Year",
            "Quarter_Of_Year",
        ]
        preprocess.save_data(df_shap, f"shap_values_deeplift_{date}.csv")

    shap_values_aggregated_for_day = np.mean(np.array(shap_values), axis=1)
    df_is_shap = pd.DataFrame(shap_values_aggregated_for_day)
    df_is_shap.columns = [
        "Close",
        "Volume",
        "High_Low_Pct",
        "Open_Close_Pct",
        "Day_Of_Week",
        "Month_Of_Year",
        "Quarter_Of_Year",
    ]

    shap_values = np.mean(shap_values, axis=0)

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

    date_start = df_clean["Date"][start]
    date_end = df_clean["Date"][end - 1]

    preprocess.save_data(df_is_shap, f"shap_values_is_deeplift_{date_start}_{date_end}.csv")
    preprocess.save_data(df_shap, f"shap_values_deeplift_{date_start}_{date_end}.csv")
    return shap_values, e


def get_important_features_lime(start, end, sequence_length):
    model, background_data, test_sample_data, _ = prepare_data(sequence_length, sequence_length, sequence_length)

    print("Base:", background_data.shape)
    print("Test:", test_sample_data.shape)

    explainer = KernelShap(model)
    shap_values = explainer.attribute(
        torch.Tensor(np.array(test_sample_data)),
        torch.Tensor(np.array(background_data)),
    )

    shap_values = np.array(shap_values)

    df_clean = preprocess.load_data("df_clean.csv")
    for x in range(start, end):
        print(x - start)
        date = df_clean["Date"][x]
        df_shap = pd.DataFrame(shap_values[x - start])
        df_shap.columns = [
            "Close",
            "Volume",
            "High_Low_Pct",
            "Open_Close_Pct",
            "Day_Of_Week",
            "Month_Of_Year",
            "Quarter_Of_Year",
        ]
        preprocess.save_data(df_shap, f"shap_values_lime_{date}.csv")

    shap_values_aggregated_for_day = np.mean(np.array(shap_values), axis=1)
    df_is_shap = pd.DataFrame(shap_values_aggregated_for_day)
    df_is_shap.columns = [
        "Close",
        "Volume",
        "High_Low_Pct",
        "Open_Close_Pct",
        "Day_Of_Week",
        "Month_Of_Year",
        "Quarter_Of_Year",
    ]

    shap_values = np.mean(np.array(shap_values), axis=0)
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
    date_start = df_clean["Date"][start]
    date_end = df_clean["Date"][end - 1]

    preprocess.save_data(df_is_shap, f"shap_values_is_lime_{date_start}_{date_end}.csv")
    preprocess.save_data(df_shap, f"shap_values_lime_{date_start}_{date_end}.csv")

    return shap_values, explainer


def pepareShapleyInterpretation(startTimestep, endTimestep, sequence_length):
    df_clean = preprocess.load_data("df_clean.csv")
    test_df = df_clean[startTimestep:endTimestep]
    preprocess.save_data(test_df["Date"][::-1], "time_df.csv")

    test_df = test_df[
        ["Close", "Volume", "High_Low_Pct", "Open_Close_Pct", "Day_Of_Week", "Month_Of_Year", "Quarter_Of_Year"]
    ]

    scaler = joblib.load(Path(model_dir, "scaler.gz"))
    ground_truth_df = test_df["Close"]
    test_df = pd.DataFrame(scaler.transform(test_df), index=test_df.index, columns=test_df.columns)

    preprocess.save_data(test_df, "test.csv")
    preprocess.save_data(ground_truth_df, "ground_truth_df.csv")

    predictions_descaled, labels_descaled, predictions = inference.predict(
        df=test_df, label_name="Close", sequence_length=sequence_length
    )

    print(predictions_descaled)
    print(labels_descaled)
    predictions_df = pd.DataFrame(predictions_descaled)
    predictions_df.columns = ["Close"]
    preprocess.save_data(predictions_df, "predictions_df.csv")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--background-data-size", type=int, default=params["background_data_size"])
    parser.add_argument("--test-sample-size", type=int, default=params["test_sample_size"])
    parser.add_argument("--algorithm", type=str, default="lime")
    parser.add_argument("--start", type=int, default=0)
    parser.add_argument("--end", type=int, default=30)
    args = parser.parse_args()
    end = args.end + 1
    sequence_length = end - args.start

    pepareShapleyInterpretation(args.start - sequence_length, end, sequence_length)
    test_df = preprocess.load_data("test.csv")

    if args.algorithm == "lime":
        shap_values, explainer = get_important_features_lime(args.start, end, sequence_length)
    elif args.algorithm == "deeplift":
        shap_values, explainer = get_important_features_shapley(
            args.start, end, args.background_data_size, args.test_sample_size, sequence_length
        )

    print("computed shapley values")
