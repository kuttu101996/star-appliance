const Unauthorize = () => {
  return (
    <div className="w-full h-[95vh] flex items-center justify-center">
      <div className="w-[95%] lg:w-[1000px] h-[500px] flex flex-col items-center justify-center bg-red-500 text-white">
        <h1 className="text-8xl lg:text-9xl mt-[-40px] mb-1">403</h1>
        <h3 className="text-3xl font-medium mb-1">You are not authorized!</h3>
        <p className="text-xl text-center">
          You tried to access a page you did not have prior authorization for.
        </p>
      </div>
    </div>
  );
};

export default Unauthorize;
