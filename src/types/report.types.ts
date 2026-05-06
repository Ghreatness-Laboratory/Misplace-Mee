export interface ReportProps {
  id: number;
  title: string;
  description: string;
  location: string;
  date_reported: string;
  status: string;
  phone_number: string;
  image: string;
  category?: string;
  created_at?: string;
}