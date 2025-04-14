type CardDataTypes = {
  id: string;
  icon: JSX.Element;
  type: "Anger" | "Fear" | "Blame" | "Sorrow" | "Confusion" | "Happiness" | "Calm" | string;
  bgColor: string;
  iconBgColor: string;
  issueText: string;
  description: string;
};
export default CardDataTypes