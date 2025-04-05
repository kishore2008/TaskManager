
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { TaskProvider } from "@/context/TaskContext";
import { AppLayout } from "@/components/Layout/AppLayout";

import Dashboard from "./pages/Dashboard";
import TaskListPage from "./pages/TaskListPage";
import NewTaskPage from "./pages/NewTaskPage";
import UpcomingTasksPage from "./pages/UpcomingTasksPage";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <TaskProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
              <Route path="/tasks" element={<AppLayout><TaskListPage filter="all" title="All Tasks" /></AppLayout>} />
              <Route path="/completed" element={<AppLayout><TaskListPage filter="completed" title="Completed Tasks" /></AppLayout>} />
              <Route path="/new-task" element={<AppLayout><NewTaskPage /></AppLayout>} />
              <Route path="/category/:categoryId" element={<AppLayout><TaskListPage filter="category" /></AppLayout>} />
              <Route path="/upcoming" element={<AppLayout><UpcomingTasksPage /></AppLayout>} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TaskProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
