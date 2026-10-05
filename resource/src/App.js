import { Routes, Route, Navigate } from "react-router-dom";
import List from "./component/List";
import Detail from "./component/Detail";

function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={<Navigate to="/courses" replace />}
            />

            <Route
                path="/courses"
                element={<List />}
            />

            <Route
                path="/detail/:id"
                element={<Detail />}
            />

            <Route
                path="*"
                element={<Navigate to="/courses" replace />}
            />
        </Routes>
    );
}

export default App;