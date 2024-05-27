import Main from "./components/Main";
import { Provider } from "react-redux";
import store from "./Redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";

const App = () => {
  let persistor = persistStore(store);
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <div className=" overflow-hidden">
          <Main />
        </div>
      </PersistGate>
    </Provider>
  );
};

export default App;
