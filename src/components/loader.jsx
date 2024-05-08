import "../style/loader.css";

const Loader = (props) => {
  return (
    <div className="wrapper" {...props}>
      <p>{props.children}</p>
      <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
  );
};

export default Loader;
