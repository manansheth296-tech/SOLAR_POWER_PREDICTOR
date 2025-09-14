import { Card } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SolarChartProps {
  data: Array<{
    hour: string;
    power: number;
    efficiency: number;
  }>;
}

export function SolarChart({ data }: SolarChartProps) {
  return (
    <Card className="p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-white/30 dark:border-gray-600/30 shadow-lg">
      <h3 className="mb-4 flex items-center gap-2">
        24-Hour Solar Power Generation
        <span className="text-sm text-gray-500 dark:text-gray-400">(Real-time prediction)</span>
      </h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" className="dark:stroke-gray-600" />
            <XAxis 
              dataKey="hour" 
              stroke="#6b7280"
              className="dark:stroke-gray-400"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              className="dark:stroke-gray-400"
              fontSize={12}
              label={{ value: 'Power (kW)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                backdropFilter: 'blur(8px)',
              }}
              wrapperClassName="dark:[&>div]:bg-gray-800/90 dark:[&>div]:border-gray-600/30"
              formatter={(value: number, name: string) => [
                `${value.toFixed(2)} ${name === 'power' ? 'kW' : '%'}`,
                name === 'power' ? 'Power Output' : 'Efficiency'
              ]}
            />
            <Line
              type="monotone"
              dataKey="power"
              stroke="url(#powerGradient)"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#1d4ed8' }}
            />
            <defs>
              <linearGradient id="powerGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-green-500"></div>
          <span>Solar Power Output</span>
        </div>
      </div>
    </Card>
  );
}