import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Main from "../Pages/Main";
import PrivatePage from "./PrivatePage";
import Company from "../Pages/Company";

function Router() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Main />}></Route>

          <Route
            path="/company"
            element={
              <PrivatePage>
                <Company />
              </PrivatePage>
            }
          ></Route>
          
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default Router;
