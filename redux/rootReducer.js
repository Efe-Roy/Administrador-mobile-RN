import authSlice from "./features/authSlice";
import basketSlice from "./features/basketSlice";

const rootReducer = {
  basket: basketSlice,
  auth: authSlice
};

export default rootReducer;
