class Game {
    rows
    score = 0


    getFirstRow() {
        return this.rows[0];
    }

    getLastRow() {
        return this.rows[this.rows.length - 1]
    }
}