declare module 'to-words' {
  interface ConverterOptions {
    currency?: boolean;
    ignoreDecimal?: boolean;
    ignoreZeroCurrency?: boolean;
    doNotAddOnly?: boolean;
  }

  interface ToWordsOptions {
    localeCode?: string;
    converterOptions?: ConverterOptions;
  }

  class ToWords {
    constructor(options?: ToWordsOptions);
    convert(number: number, options?: ConverterOptions): string;
  }

  export = ToWords;
}
