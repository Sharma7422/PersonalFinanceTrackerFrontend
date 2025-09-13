import Confetti from "react-confetti";

export default function AchievementConfetti({ show }) {
  if (!show) return null;
  return <Confetti width={window.innerWidth} height={window.innerHeight} />;
}