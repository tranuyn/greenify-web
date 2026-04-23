export interface Province {
  code: number;
  codename: string;
  divisionType: string;
  name: string;
  phoneCode: number;
}

export interface Ward {
  code: number;
  codename: string;
  divisionType: string;
  name: string;
  provinceCode: number;
}