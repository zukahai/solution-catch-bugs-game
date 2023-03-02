class Matrix {
    static rotateBlockNext(matrix) {
        let temp = []
        let m = matrix.length;
        let n = matrix[0].length;
        let index1 = 0;
        let index2 = m - 1;
        for (let i = 0; i < n; i++) {
            let t = [];
            for (let j = 0; j < m; j++) {
                t[j] = matrix[index2][index1];
                index2--;
            }
            index2 = m - 1;
            index1++;
            temp[i] = t;
        }
        return temp;
    }

    static symmetryBlock(matrix) {
        let m = matrix.length;
        let n = matrix[0].length;
        for (let i = 0; i < m; i++)
            for (let j = 0; j < n / 2; j++) {
                let t = matrix[i][j];
                matrix[i][j] = matrix[i][n - j - 1];
                matrix[i][n - j - 1] = t;
            }
        return matrix;
    }

    static copyMatrix(matrix) {
        let temp = [];
        for (let i = 0; i < matrix.length; i++) {
            let temp2 = [];
            for (let j = 0; j < matrix[0].length; j++)
                temp2[j] = matrix[i][j];
            temp[i] = temp2;
        }
        return temp;
    }

    static check(matrix1, matrix2) {
        if (matrix1.length != matrix2.length || matrix1[0].length != matrix2[0].length)
            return false;
        let count = 0;
        for (let i = 0; i < matrix1.length; i++)
            for (let j = 0; j < matrix1[0].length; j++)
                if (matrix1[i][j] + matrix2[i][j] == 3)
                    count++;
        if (count == 6)
            return true;
        return false;
    }
}