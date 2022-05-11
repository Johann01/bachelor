# bachelor

## Installation

For the Backend you need a running Python Version of 3.7 or higher. It needs to the default system python that you install the packages in.
To run the frontend Node needs to be installed.

You can download the installer here: https://nodejs.org/en

With MacOSX you run:

```
brew install node
```

And with Ubuntu you run:

```
sudo apt-get install nodejs
```

### Getting started

First clone the repository and install the backend dependies.

```
git clone git@github.com:Johann01/bachelor.git
cd bachelor/backend
pip install -r requirements.txt
```

After that move into the frontend and run the project:

```
cd ../frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Using the program first has a slow startup time, because the backend needs to be compiuled first.
