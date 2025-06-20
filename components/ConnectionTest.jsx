"use client";

import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { healthCheck, handleApiError } from "@/lib/api";

export default function ConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState("checking");
  const [error, setError] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const testConnection = async () => {
    setConnectionStatus("checking");
    setError(null);

    try {
      const result = await healthCheck();

      if (result.success) {
        setConnectionStatus("connected");
        setLastChecked(new Date());
        setError(null);
      } else {
        setConnectionStatus("error");
        setError("Backend returned an error");
      }
    } catch (err) {
      setConnectionStatus("error");
      setError(handleApiError(err));
    }
  };

  const retryConnection = async () => {
    setIsRetrying(true);
    await testConnection();
    setIsRetrying(false);
  };

  useEffect(() => {
    testConnection();
  }, []);

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "checking":
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case "connected":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (connectionStatus) {
      case "checking":
        return "Checking backend connection...";
      case "connected":
        return "Backend is running and responding correctly";
      case "error":
        return "Unable to connect to backend server";
      default:
        return "Unknown connection status";
    }
  };

  const getAlertVariant = () => {
    switch (connectionStatus) {
      case "connected":
        return "default";
      case "error":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Backend Connection Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant={getAlertVariant()}>
          <AlertTitle className="flex items-center gap-2">
            Connection Status
          </AlertTitle>
          <AlertDescription>{getStatusMessage()}</AlertDescription>
        </Alert>

        {connectionStatus === "error" && error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Details</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {connectionStatus === "error" && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Troubleshooting</AlertTitle>
            <AlertDescription>
              <div className="mt-2 space-y-1 text-sm">
                <p>1. Make sure the backend server is running:</p>
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  cd flask_backend && python run.py
                </code>
                <p>2. Check that port 5001 is available</p>
                <p>3. Verify no firewall is blocking the connection</p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {lastChecked && (
          <div className="text-sm text-gray-600">
            Last checked: {lastChecked.toLocaleTimeString()}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={retryConnection}
            disabled={isRetrying || connectionStatus === "checking"}
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            {isRetrying ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isRetrying ? "Retrying..." : "Retry Connection"}
          </Button>

          {connectionStatus === "connected" && (
            <Button
              onClick={() => window.location.reload()}
              size="sm"
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Continue
            </Button>
          )}
        </div>

        {connectionStatus === "connected" && (
          <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
            ✅ Ready to use the Baby Diet Recommender!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
