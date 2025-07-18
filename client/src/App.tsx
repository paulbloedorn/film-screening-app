import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Conference from "@/pages/conference";
import Hospital from "@/pages/hospital";
import Education from "@/pages/education";
import Corporate from "@/pages/corporate";
import NotFound from "@/pages/not-found";
import AdminRoute from "@/components/admin-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/conference" component={Conference} />
      <Route path="/hospital" component={Hospital} />
      <Route path="/education" component={Education} />
      <Route path="/corporate" component={Corporate} />
      <Route path="/admin" component={AdminRoute} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="font-body bg-cream-100 text-gray-800">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
