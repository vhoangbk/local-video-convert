"use client";

import { Progress } from "./progress";

type ProgressWrapperProps = {
  show: boolean;
  percent: string;
  remainingTime: number;
  message: string;
};

export function ProgressWrapper({
  show,
  percent,
  remainingTime,
  message,
}: ProgressWrapperProps) {
  if (!show) return null;

  return (
    <Progress
      percent={percent}
      remainingTime={remainingTime}
      message={message}
    />
  );
}
