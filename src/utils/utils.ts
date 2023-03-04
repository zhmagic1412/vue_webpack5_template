const jsonp = <T = any>(url: string): Promise<T> => {
  return new Promise((resolve, reject) => {

    (window.globalThis as any).jsonCallBack = (result:any) => resolve(result);

    const script = document.createElement("script");
    script.src = url;
    script.type = "text/javascript";
    script.async = true;
    document.getElementsByTagName("head")[0].appendChild(script);
    setTimeout(() => {
      document.getElementsByTagName("head")[0].removeChild(script);
    }, 500);
  });
};

export{
    jsonp
}
