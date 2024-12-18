import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "@/layouts";
import { QueryClient, QueryClientProvider } from "react-query";
import { SignIn, SignUp } from "./pages/auth";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/auth/sign-in" exact={true} element={<SignIn />} />
        <Route path="/auth/sign-up" exact={true} element={<SignUp />} />
        <Route path="/*" element={<Dashboard />} />
        <Route
          path="*"
          element={<Navigate to="/dashboard/home" replace />}
        />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
