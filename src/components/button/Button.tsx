import './btn.css';

type BtnProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  txt: String;
};

function Button({ onClick, txt }: BtnProps) {
  return <button onClick={onClick}>{txt}</button>;
}

export default Button;
