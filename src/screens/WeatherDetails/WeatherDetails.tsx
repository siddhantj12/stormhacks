import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";

export const WeatherDetails = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <main className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 w-full min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-white mb-8 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft size={24} />
          <span className="text-lg font-medium">Back to Weather</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/20 backdrop-blur-lg border-0 rounded-3xl">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-white mb-6">
                Extended Forecast
              </h2>
              <p className="text-white/90 text-lg">
                Detailed 7-day forecast and weather patterns coming soon.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/20 backdrop-blur-lg border-0 rounded-3xl">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-white mb-6">
                Weather Maps
              </h2>
              <p className="text-white/90 text-lg">
                Interactive weather maps and radar coming soon.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/20 backdrop-blur-lg border-0 rounded-3xl">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-white mb-6">
                Weather Alerts
              </h2>
              <p className="text-white/90 text-lg">
                Real-time weather alerts and warnings coming soon.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/20 backdrop-blur-lg border-0 rounded-3xl">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-white mb-6">
                Historical Data
              </h2>
              <p className="text-white/90 text-lg">
                View historical weather data and trends coming soon.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};
