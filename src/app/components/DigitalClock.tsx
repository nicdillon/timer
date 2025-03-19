import { FormatTime } from '../lib/utils';

interface DigitalClockProps {
    time: number, 
    isActive: boolean, 
    label: string
}

export default function DigitalClock({ time, isActive = false, label = "" }: DigitalClockProps) {
        return (
            <span
                className={`text-6xl font-bold ${isActive ? "text-white" : "text-gray-400"}`}
            >
                {FormatTime(time)} {label && `(${label})`}
            </span>
        );
    }