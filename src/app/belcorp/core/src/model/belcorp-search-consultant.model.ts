export interface SearchConsultant {
  id?: string;
  country_iso?: string;
  first_name?: string;
  middle_name?: string;
  consultant_code?: string;
  first_last_name?: string;
  second_last_name?: string;
  full_name?: string;
  email?: string;
  image?: string;
}

export interface SearchUbigeo {
  code?: string;
  geographical_unit_1?: string;
  geographical_unit_2?: string;
  geographical_unit_3?: string;
}
