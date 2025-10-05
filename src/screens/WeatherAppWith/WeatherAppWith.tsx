import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import {
  getCurrentWeather,
  getHourlyForecast,
  getDailyForecast,
  WeatherData,
  HourlyForecast,
  DailyForecast
} from "../../services/weatherService";

export const WeatherAppWith = (): JSX.Element => {
  const navigate = useNavigate();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [weeklyForecast, setWeeklyForecast] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const [currentWeather, hourly, daily] = await Promise.all([
          getCurrentWeather('Vancouver'),
          getHourlyForecast('Vancouver'),
          getDailyForecast('Vancouver')
        ]);
        setWeather(currentWeather);
        setHourlyForecast(hourly);
        setWeeklyForecast(daily);
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  if (loading || !weather) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-blue-600">
        <div className="text-white text-2xl">Loading weather data...</div>
      </div>
    );
  }

  const infoCards = [
    {
      title: "LOCATION DATE",
      icon: "/vector.svg",
      mainText: weather.location,
      subText: weather.date,
    },
    {
      title: "PRECIPITATION",
      icon: "/blur.png",
      mainText: `${weather.precipitation.toFixed(2)}mm`,
      subText: "In last hour",
      footer: "Based on current conditions",
    },
    {
      title: "WIND",
      icon: "/wind.png",
      mainText: `${weather.windSpeed}km/h`,
      hasCompass: true,
    },
    {
      title: "UV INDEX",
      icon: "/sun.png",
      mainText: weather.uvIndex.toString(),
      subText: "Moderate",
      hasUVBar: true,
    },
    {
      title: "SUNRISE",
      icon: "/sunrise.png",
      mainText: weather.sunrise,
      footer: `SUNSET ${weather.sunset}`,
      hasSunGraphic: true,
    },
  ];
  return (
    <main className="bg-white w-full min-w-[1512px] min-h-[982px] relative">
      <img
        className="absolute top-0 left-0 w-[1512px] h-[982px] object-cover"
        alt="Weather background"
        src="/unsplash-7issqnpcibw.png"
      />

      <section className="absolute top-[120px] left-[92px] w-[425px] h-[302px] flex flex-col">
        <header className="flex w-44 items-center gap-[5px] h-[30px]">
          <img
            className="w-[30px] h-[30px]"
            alt="Location frame"
            src="/frame-3.svg"
          />
          <h1 className="w-[125px] h-6 font-medium text-white text-2xl tracking-[0] whitespace-nowrap [font-family:'Inter',Helvetica] leading-[normal]">
            {weather.location}
          </h1>
          <img
            className="w-[11px] h-[21px]"
            alt="Chevron"
            src="/vector-1.svg"
          />
        </header>

        <div className="flex items-center justify-center w-[417px] h-[47px] mt-[25px] [font-family:'Inter',Helvetica] font-semibold text-white text-5xl tracking-[0] leading-[normal] whitespace-nowrap">
          {weather.condition}
        </div>

        <div className="ml-px w-64 h-[101px] mt-8 [font-family:'Inter',Helvetica] font-medium text-white text-9xl tracking-[0] leading-[128px] whitespace-nowrap">
          <span className="leading-[88.0px]">{weather.temperature}°C</span>
        </div>

        <time className="ml-px w-[205px] h-7 mt-[11px] [font-family:'Inter',Helvetica] font-normal text-white text-lg tracking-[0] leading-[normal]">
          {weather.date}
        </time>

        <time className="ml-px w-[205px] h-7 [font-family:'Inter',Helvetica] font-normal text-white text-lg tracking-[0] leading-[normal]">
          {weather.time}
        </time>
      </section>

      <section className="absolute top-[483px] left-[92px] flex gap-[7px]">
        {infoCards.map((card, index) => (
          <Card
            key={index}
            className="w-[161px] h-[161px] bg-[#b0bebe80] rounded-[18px] border-0"
          >
            <CardContent className="p-0 relative w-full h-full">
              <div className="absolute top-[11px] left-[47px] [font-family:'Inter',Helvetica] font-normal text-[#ffffff99] text-xs tracking-[0.84px] leading-[normal]">
                {card.title}
              </div>

              <img
                className="absolute top-[9px] left-4 w-[18px] h-[18px]"
                alt={card.title}
                src={card.icon}
              />

              {card.hasCompass ? (
                <>
                  <div className="absolute top-[29px] left-[13px] w-[98px] h-[109px]">
                    <div className="absolute top-0 left-0 w-[100px] h-[29px] flex">
                      <div className="w-[98px] h-[29px] [font-family:'Inter',Helvetica] font-extrabold text-white text-2xl text-center tracking-[1.68px] leading-[normal]">
                        {card.mainText}
                      </div>
                    </div>
                    <img
                      className="absolute w-[63.27%] h-[56.88%] top-[43.12%] left-[34.69%]"
                      alt="Wind direction"
                      src="/drag-pan.svg"
                    />
                  </div>
                  <div className="absolute top-[65px] left-[75px] w-[7px] [font-family:'Inter',Helvetica] font-medium text-white text-[10px] tracking-[0.70px] leading-[normal] whitespace-nowrap">
                    N
                  </div>
                  <div className="absolute top-[103px] left-28 w-1.5 [font-family:'Inter',Helvetica] font-medium text-[#00000080] text-[10px] tracking-[0.70px] leading-[normal] whitespace-nowrap">
                    E
                  </div>
                  <div className="absolute top-[103px] left-9 w-2 [font-family:'Inter',Helvetica] font-medium text-white text-[10px] tracking-[0.70px] leading-[normal] whitespace-nowrap">
                    W
                  </div>
                  <div className="absolute top-[140px] left-[75px] w-1.5 [font-family:'Inter',Helvetica] font-medium text-white text-[10px] tracking-[0.70px] leading-[normal] whitespace-nowrap">
                    S
                  </div>
                </>
              ) : card.hasUVBar ? (
                <>
                  <div className="absolute top-[38px] left-4 w-[92px] [font-family:'Inter',Helvetica] font-normal text-white text-2xl tracking-[0] leading-[normal]">
                    <span className="font-medium">
                      {card.mainText}
                      <br />
                    </span>
                    <span className="font-light text-base">{card.subText}</span>
                  </div>
                  <div className="absolute top-0 left-0 w-[161px] h-[161px] flex gap-[11.6px]">
                    <div className="mt-[114px] w-[9.4px] h-[9.4px] ml-[57px] bg-white rounded-[4.7px] border-[0.2px] border-solid border-[#ffffff75] shadow-[0px_2px_4px_#000000d1]" />
                    <div className="mt-[53.3px] w-[4.97px] h-[130.99px] rounded-[5px] rotate-[-89.75deg] bg-[linear-gradient(180deg,rgba(252,228,72,1)_0%,rgba(231,110,54,0.85)_54%,rgba(241,28,28,1)_100%)]" />
                  </div>
                </>
              ) : card.hasSunGraphic ? (
                <>
                  <div className="absolute top-[38px] left-4 w-[119px] [font-family:'Inter',Helvetica] font-medium text-white text-2xl tracking-[0] leading-[normal] whitespace-nowrap">
                    {card.mainText}
                  </div>
                  <div className="absolute top-[133px] left-4 w-[129px] [font-family:'Inter',Helvetica] font-light text-white text-xs tracking-[0.84px] leading-[normal]">
                    {card.footer}
                  </div>
                  <img
                    className="absolute top-[560px] left-[812px] w-[61px] h-[46px]"
                    alt="Sun arc"
                    src="/vector-111.svg"
                  />
                  <img
                    className="absolute top-[560px] left-[873px] w-[61px] h-[46px]"
                    alt="Sun arc vertical"
                    src="/vector-111-m-vertical-1.svg"
                  />
                  <img
                    className="absolute top-[560px] left-[873px] w-7 h-[7px]"
                    alt="Sun arc detail"
                    src="/vector-111-m-vertical.svg"
                  />
                  <img
                    className="absolute top-[606px] left-[796px] w-[161px] h-px object-cover"
                    alt="Separator line"
                    src="/line-11.svg"
                  />
                  <img
                    className="absolute top-[556px] left-[892px] w-[27px] h-[27px]"
                    alt="Sun icon"
                    src="/clear-day.png"
                  />
                  <img
                    className="absolute top-[558px] left-[894px] w-[23px] h-[23px]"
                    alt="Sun icon detail"
                    src="/clear-day-1.png"
                  />
                </>
              ) : (
                <>
                  <div className="absolute top-[38px] left-4 w-[92px] [font-family:'Inter',Helvetica] font-normal text-white text-2xl tracking-[0] leading-[normal]">
                    {card.mainText === "Vancouver" ? (
                      <>
                        <span className="font-medium text-[22px]">
                          {card.mainText}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="font-medium">
                          {card.mainText}
                          <br />
                        </span>
                        <span className="font-light text-base">
                          {card.subText}
                        </span>
                      </>
                    )}
                  </div>
                  {card.footer && (
                    <div className="absolute top-[121px] left-4 w-[129px] [font-family:'Inter',Helvetica] font-light text-white text-xs tracking-[0.84px] leading-[normal] whitespace-pre-line">
                      {card.footer}
                    </div>
                  )}
                  {card.mainText === "Vancouver" && (
                    <div className="absolute top-[121px] left-4 w-[129px] [font-family:'Inter',Helvetica] font-light text-white text-xs tracking-[0.84px] leading-[normal] whitespace-pre-line">
                      {card.subText}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="absolute top-[664px] left-[92px] w-[865px] h-[266px]">
        <Card className="w-full h-full bg-[#b1bfbf99] rounded-3xl border-0">
          <CardContent className="p-0 relative w-full h-full">
            {weeklyForecast.map((day, index) => (
              <div
                key={index}
                className="absolute flex flex-col items-center"
                style={{
                  left: `${92 + index * 138}px`,
                  top: "48px",
                }}
              >
                <img
                  className="w-[70px] h-[53px] mb-4"
                  alt={`${day.day} weather`}
                  src={day.icon}
                />
                <div className="flex items-start mt-[17px]">
                  <span className="[font-family:'Inter',Helvetica] font-normal text-white text-[50px] tracking-[0] leading-[normal]">
                    {typeof day.temp === 'string' ? day.temp : day.temp}
                  </span>
                  <span className="[font-family:'Gelica-Regular',Helvetica] font-normal text-white text-[22px] tracking-[0] leading-[normal] mt-[3px]">
                    °
                  </span>
                </div>
                <div className="[font-family:'Inter',Helvetica] font-light text-white text-2xl tracking-[0] leading-[normal] mt-[7px]">
                  {day.day}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <aside className="absolute top-[183px] left-[1102px] w-[345px] h-[749px]">
        <img
          className="absolute top-0 left-0 w-[345px] h-[749px]"
          alt="Hourly forecast background"
          src="/rectangle-916.svg"
        />

        <div className="absolute top-[37px] left-[41px] w-[264px] h-[25px] flex items-center justify-center [font-family:'Inter',Helvetica] font-medium text-black text-[25px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
          12 - HOUR FORCAST
        </div>

        <Separator className="absolute top-[81px] left-[44px] w-[301px] h-px bg-black" />

        <div className="absolute top-[100px] left-[33px] w-[275px] h-[635px] flex flex-col gap-[14px]">
          {hourlyForecast.map((hour, index) => (
            <div
              key={index}
              className="w-[279.21px] h-[38.25px] relative flex items-center"
            >
              <time className="absolute left-0 top-[7px] w-[70px] [font-family:'Inter',Helvetica] font-normal text-white text-2xl text-center tracking-[0] leading-[normal] whitespace-nowrap">
                {hour.time}
              </time>

              <div className="absolute top-[19px] left-[82px] w-[145px] h-[5px] flex items-center">
                <img
                  className="w-[28.68px] h-[1.02px]"
                  alt="Line left"
                  src="/line-1.svg"
                />
                <div className="w-[4.78px] h-[4.78px] bg-white rounded-[2.39px] rotate-90 mx-[1px]" />
                <div className="flex-1" />
                <div className="w-[4.78px] h-[4.78px] bg-white rounded-[2.39px] -rotate-90 mx-[1px]" />
                <img
                  className="w-[28.68px] h-[1.02px]"
                  alt="Line right"
                  src="/line-2.svg"
                />
              </div>

              <div className="absolute left-[129px] top-0 w-[58px] h-[38px] flex flex-col items-center gap-[2px]">
                <img
                  className="w-[22px] h-[22px]"
                  alt="Weather icon"
                  src={hour.icon}
                />
                <div className="w-14 [font-family:'Inter',Helvetica] font-normal text-[#363a3f] text-base text-center tracking-[0] leading-[normal] whitespace-nowrap">
                  {typeof hour.windSpeed === 'string' ? hour.windSpeed : `${hour.windSpeed}km/h`}
                </div>
              </div>

              <div className="absolute left-[239px] top-[7px] w-9 [font-family:'Inter',Helvetica] font-medium text-white text-xl text-center tracking-[0] leading-[normal] whitespace-nowrap">
                {typeof hour.temp === 'string' ? hour.temp : `${hour.temp}°`}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <img
        className="absolute top-0 left-[1049px] w-[463px] h-[321px] object-cover cursor-pointer hover:opacity-80 transition-opacity"
        alt="Additional weather visual"
        src="/image-6.png"
        onClick={() => navigate('/details')}
      />
    </main>
  );
};
