'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { students } from './data';
import type { Student } from './definitions';
import { loginSchema, studentSchema } from './schema';

// --- AUTH ACTIONS ---

export async function login(values: z.infer<typeof loginSchema>) {
  // In a real app, you'd validate against a database
  if (values.email === 'admin@campusflow.com' && values.password === 'password123') {
    redirect('/dashboard');
  } else {
    return { error: 'Invalid email or password.' };
  }
}

// --- STUDENT ACTIONS ---

export async function getStudents() {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 500));
  return students;
}

export async function getStudentById(id: string) {
  return students.find(student => student.id === id);
}

export async function addStudent(values: z.infer<typeof studentSchema>) {
  const newStudent: Student = {
    ...values,
    id: String(Date.now()),
  };
  students.unshift(newStudent); // Add to the beginning of the array
  revalidatePath('/dashboard');
  return { success: 'Student added successfully.' };
}

export async function updateStudent(id: string, values: z.infer<typeof studentSchema>) {
  const index = students.findIndex(s => s.id === id);
  if (index !== -1) {
    students[index] = { ...students[index], ...values };
    revalidatePath('/dashboard');
    revalidatePath(`/dashboard/edit-student/${id}`);
    return { success: 'Student updated successfully.' };
  }
  return { error: 'Student not found.' };
}

export async function deleteStudent(id: string) {
  const index = students.findIndex(s => s.id === id);
  if (index !== -1) {
    students.splice(index, 1);
    revalidatePath('/dashboard');
    return { success: 'Student deleted successfully.' };
  }
  return { error: 'Student not found.' };
}
