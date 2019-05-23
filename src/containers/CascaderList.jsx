export const widthOptions = {
  propName: 'width',
  defaultValue: 'auto',
  options: [
    {value: 'auto'},
    {
      value:'<length>',
      min:0,
      max:100,
      children:'slider'
    },
  ],
  key:'width'
}

export const fontSizeOptions = {
  propName: 'font-size',
  defaultValue: '16px',
  options: [
    {
      value: 'auto'
    },
    {
      value:'<length>',
      children:{
        value:'slider',
        points:[0,100]
      }
    },
  ],
  key:'font-size'
}