# bachelor

## Installation

For the Backend you need a running Python Version of 3.7 or higher. It needs to the default system python that you install the packages in.
To run the frontend Node needs to be installed.

You can download the installer here: https://nodejs.org/en

```
git clone git@github.com:Johann01/bachelor.git
cd bachelor/backend
pip install -r requirements.txt
```

After move into the frontend, install the depenedencies and start the frontend.

```
cd ../frontend
npm install
npm run dev
```

After the navigatio runs you can access the frontend at http://localhost:3000.
To start the first XAI interpretation process you need to click on the blue save button in the Data Selection View.
Because of the API needing to be compiled, the first time you start the interpretation process it takes around 30 sec.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
