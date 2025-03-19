import { FormatTime } from '../lib/utils';

interface AnalogClockProps {
    timeLeft: number, 
    duration: number,
    elapsedTime: number,
    isCountingDown: boolean,
    isActive: boolean
}

export default function AnalogClock({ timeLeft, duration, elapsedTime = 0, isCountingDown = true, isActive }: AnalogClockProps) {
    let progress = timeLeft / (duration * 60);
    if (!isCountingDown) {
        progress = elapsedTime / 3600;
    }
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - progress);

    const renderTickMarks = (radius: number) => {
        return (
            <>
                {[...Array(12)].map((_, i) => {
                    const angle = (i * 360) / 12;
                    const rad = (angle * Math.PI) / 180;
                    const x1 = 60 + radius * 1 * Math.cos(rad);
                    const y1 = 60 + radius * 1 * Math.sin(rad);
                    const x2 = 60 + radius * 0.8 * Math.cos(rad);
                    const y2 = 60 + radius * 0.8 * Math.sin(rad);
                    return (
                        <line
                            key={i}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="gray"
                            strokeWidth="2"
                        />
                    );
                })}
            </>
        );
    };

    return (
        <svg width="100%" height="100%" viewBox={`0 0 120 120`}>
            <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="black"
                strokeWidth="8"
                fill="black"
            />
            <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="red"
                strokeWidth="12"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transform="rotate(-90,60,60)"
            />
            {renderTickMarks(radius)}
            <text
                x="60"
                y={60 + radius / 6}
                textAnchor="middle"
                fill={isActive ? "white" : "gray"}
                fontSize={radius / 2}
            >
                {FormatTime(timeLeft)}
            </text>
        </svg>
    );
}