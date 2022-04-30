## Installation

This codes bases is from https://github.com/danielhkt/deep-forecasting.git
and his medium article [Medium / Towards Data Science blog post](https://towardsdatascience.com/multivariate-time-series-forecasting-with-deep-learning-3e7b3e2d2bcf)

## Download Data

Download the [data](https://finance.yahoo.com/quote/BTC-USD/history?p=BTC-USD) and create a 'data' folder for the downloaded file.

## Run in Notebook

An example notebook to run the entire pipeline and print/visualize the results in included in ../notebook.
Update the parameters in /model/params.yaml if necessary.

## Run in Terminal

The python scripts to prepare the data, train and evaluate the model, as well as interpret the model,
are stored in ../scripts. The parameters used for training and interpreting the model are stored in
../model/params.yaml. The data and model outputs are stored in the /data and /model folders, respectively.
Update the parameters in /model/params.yaml if necessary.

1. Prepare the data:
   ```
   python preprocess.py
   ```
2. Train the model:
   ```
   python train.py
   ```
3. Evaluate the model:
   ```
   python inference.py
   ```
4. Interpret the trained model:
   ```
   python interpret.py
   ```

## Credits

- Packages:

  - [PyTorch](https://pytorch.org/)
  - [SHAP](https://shap-lrjball.readthedocs.io/en/latest/generated/shap.DeepExplainer.html)

- Datasets:

  - [Bitcoin prices](https://finance.yahoo.com/quote/BTC-USD/history?p=BTC-USD)

- Models:
  - LSTM (Hochreiter and Schmidhuber. “Long Short-term Memory”. 1997)
  - DeepLIFT (Shrikumar, Greenside, and Kundaje. “Learning Important Features Through Propagating Activation Differences”. 2017)

## License

This project is licensed under the Apache-2.0 License.
