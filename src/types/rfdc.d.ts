declare module 'rfdc' {
  interface Options {
    proto?: boolean;
    circles?: boolean;
  }
  
  function rfdc(options?: Options): <T>(obj: T) => T;
  export = rfdc;
}