import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export const studentSchema = z.object({
  grNo: z.string().min(1, 'G.R No is required'),
  studentName: z.string().min(1, 'Student name is required'),
  fatherName: z.string().min(1, "Father's name is required"),
  raceAndCaste: z.string().min(1, 'Race and Caste is required'),
  bForm: z.string().min(1, 'B. Form is required'),
  placeOfBirth: z.string().min(1, 'Place of birth is required'),
  dateOfBirth: z.date({ required_error: 'Date of Birth is required' }),
  dateOfBirthInWords: z.string().min(1, 'Date of birth in words is required'),
  religion: z.string().min(1, 'Religion is required'),
  lastSchoolAttended: z.string().min(1, 'Last school attended is required'),
  admissionDate: z.date({ required_error: 'Admission Date is required' }),
  classInWhichAdmitted: z.string().min(1, 'Class in which admitted is required'),
  cnic: z.string().optional(),
  guardianName: z.string().min(1, 'Guardian Name is required'),
  guardianCnic: z.string().min(1, 'Guardian CNIC is required'),
  relationshipWithGuardian: z.string().min(1, 'Relationship with Guardian is required'),
  contactNo: z.string().min(1, 'Contact No. is required'),
  disability: z.string().default('N/A'),
  vaccine: z.enum(['Yes', 'No'], { required_error: 'Vaccine status is required' }),
  classStudying: z.string().min(1, 'Class is required'),
  section: z.string().min(1, 'Section is required'),
  newEnrolReEnrol: z.enum(['New Enrol', 'Re-Enrol'], { required_error: 'Enrollment status is required' }),
  remarks: z.string().optional(),
  dateOfLeaving: z.date().optional().nullable(),
  reasonOfLeaving: z.string().optional(),
  examination: z.enum(['Class 6', 'Class 7', 'Class 8', 'S.S.C Part-I Annual', 'S.S.C Part-II Annual'], { required_error: 'Examination is required' }),
  underSeatNo: z.string().min(1, 'Seat No. is required'),
  progress: z.enum(['Excellent', 'Good', 'Average', 'Poor'], { required_error: 'Progress is required' }),
  conduct: z.enum(['Excellent', 'Good', 'Average', 'Poor'], { required_error: 'Conduct is required' }),
  grade: z.string().min(1, 'Grade is required'),
  妣ype: z.enum(['SSC I', 'SSC II']).optional(),
  sscRollNo: z.string().optional(),
});

export type StudentFormValues = z.infer<typeof studentSchema>;
