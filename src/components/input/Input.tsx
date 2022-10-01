import './input.css';

type InputProps = {
  value: number | string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  name: string;
  id: string;
  type: string;
  txt: string;
};

function Input({ value, onChange, name, id, type, txt }: InputProps) {
  return (
    <div className="input-container">
      <label htmlFor={id}>{txt}</label>
      <input
        type={type}
        name={name}
        id={id}
        max={60}
        min={1}
        value={value}
        onChange={onChange}
      />
      <span>minutes</span>
    </div>
  );
}

export default Input;
