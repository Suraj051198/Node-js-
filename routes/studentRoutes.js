const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// ✅ Get all students
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM students");
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ✅ Get student by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query("SELECT * FROM students WHERE id = ?", [id]);

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        res.status(200).json({ success: true, data: rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ✅ Add a new student
router.post("/", async (req, res) => {
    try {
        const { name, roll_no, studentClass, fees, subject } = req.body;

        if (!name || !roll_no || !studentClass || !fees || !subject) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const [result] = await pool.query(
            "INSERT INTO students (name, roll_no, studentClass, fees, subject) VALUES (?, ?, ?, ?, ?)",
            [name, roll_no, studentClass, fees, subject]
        );

        res.status(201).json({ success: true, message: "Student added", studentId: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ✅ Update a student
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, roll_no, studentClass, fees, subject } = req.body;

        const [result] = await pool.query(
            "UPDATE students SET name=?, roll_no=?, studentClass=?, fees=?, subject=? WHERE id=?",
            [name, roll_no, studentClass, fees, subject, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        res.status(200).json({ success: true, message: "Student updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ✅ Delete a student
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query("DELETE FROM students WHERE id=?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        res.status(200).json({ success: true, message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
