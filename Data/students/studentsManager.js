const fs = require('fs');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');

require('dayjs/locale/fr');
dayjs.extend(customParseFormat);
dayjs.locale('fr');

/**
 * 
 * @param {string} filePath 
 * @returns {list}
 */
exports.getAllStudents = async (filePath,dateFormat) => {
    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(data);
       
        jsonData.students.forEach(student => {
            student.birth = dayjs(student.birth, 'YYYY-DD-MM').format(dateFormat);
        });
        return jsonData.students;
    } catch (error) {
        console.log(error)
        throw new Error('Error reading students data');
    }
}

/**
 * 
 * @param {string} name name of student
 * @param {string} birth birthdate of student
 * @param {string} filePath path of students.json
 * @returns {boolean}
 */
exports.addStudent = async (name, birth,filePath) => {
    try {
        if (!name || !birth) {
            console.log('missing value')
            const err = new Error('Missing Value')
            err.message='Remplisser tout les champs'
            throw err;
        }
        if (!/^[a-zA-Z]+$/.test(name)) {
            const err = new Error('Missing Value');
            err.message = 'Remplissez le nom avec des lettres uniquement';
            throw err;
        }

        if (!Date.parse(birth)) {
            const err = new Error('Bad Value');
            err.message = "La date d'anniversaire doit être une date valide";
            throw err;
        }

        const students = await this.getAllStudents(filePath,'YYYY-MM-DD');
        if (students.some(student => student.name === name)) {
            throw new Error("L'étudiant existe déjà");
        }

        const newStudent = { name, birth };
        const updatedStudents = [...students, newStudent];

        const jsonData = { students: updatedStudents };
        await fs.promises.writeFile(filePath, JSON.stringify(jsonData, null, 2));
        return true;
    } catch (error) {
        throw error;
    }
}

/**
 * 
 * @param {string} name name of student
 * @param {string} filePath path of students.json
 * @returns {boolean} 
 */
exports.deleteStudent = async (name,filePath) => {
    console.log('start delete ',name)
    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        const updatedStudents = jsonData.students.filter(student => student.name !== name);
        jsonData.students = updatedStudents;
        await fs.promises.writeFile(filePath, JSON.stringify(jsonData, null, 2));
        return true;
    } catch (error) {
        throw new Error('Error deleting student');
    }
}

