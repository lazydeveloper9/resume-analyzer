# 🧠 AI Resume Analyzer & Vulnerability Finder

An **AI-powered resume intelligence system** that analyzes resumes against job descriptions, identifies vulnerabilities and gaps, and **automatically generates a corrected, optimized resume** tailored for the target role.

---

## 🚀 Overview

This project helps job seekers improve their resumes using AI by:

- Analyzing resumes in **PDF / DOCX** format  
- Matching resumes with **job descriptions**
- Detecting **resume vulnerabilities** (missing skills, weak impact, ATS issues)
- Suggesting **role-specific improvements**
- Generating a **new corrected resume** ready to apply

The system is designed to be **ATS-friendly**, explainable, and role-aware.

---

## 🎯 Problem Statement

Most resumes get rejected due to:
- Poor alignment with job descriptions
- Missing or weak skills
- Low ATS keyword matching
- Poor structure and formatting
- Generic, non-impactful content

This tool fixes those problems **automatically**.

---

## ✨ Key Features

### 📄 Resume Analysis
- Parses PDF / DOCX resumes
- Extracts skills, experience, projects, and education
- Detects structural and formatting issues

### 🧩 Vulnerability Detection
- Missing required skills for the role
- Weak bullet points and action verbs
- ATS keyword mismatch
- Role-experience misalignment
- Resume red flags

### 🎯 Job Description Matching
- Resume vs JD comparison
- Skill gap analysis
- Relevance and compatibility scoring

### 🛠️ Resume Correction & Generation
- Fixes detected vulnerabilities
- Enhances bullet points with impact metrics
- Adds missing relevant skills
- Generates a **new optimized resume**
- Output format remains the **same as uploaded** (PDF / DOCX)

### 📊 Explainable AI Output
- Clear vulnerability report
- Before vs After comparison
- Reasoning behind each correction

---
---

## 🏗️ System Architecture

- **Frontend**: React / HTML (Upload & Results UI)
- **Backend**: FastAPI (Python)
- **AI Layer**:
  - Resume understanding & reasoning
  - Job-role matching
  - Resume rewriting & enhancement
- **Document Processing**:
  - PDF / DOCX parsing
  - Resume regeneration
- **Optional**:
  - ATS scoring
  - RAG-based skill intelligence
  - Cloud LLM APIs (Gemini / Vertex AI)

---

## 📁 Project Structure
