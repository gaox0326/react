import React from 'react'
import './index.css'

// header
// content
// footer

const ArrowUp = 'ArrowUp',
      ArrowDown = 'ArrowDown',
      ArrowLeft = 'ArrowLeft',
      ArrowRight = 'ArrowRight'

function Square(props) {
    return (
        <button className='square'>
            {props.value}
        </button>
    )
}

function Content(props) {
    return (
        <div className='content'>
            {
                Array(props.rowNumber).fill(null).map((rowValue, rowIndex) => {
                    return (
                        <div key={rowIndex} className='content-row'>
                            {
                                Array(props.colNumber).fill(null).map((colValue, colIndex) => {
                                    return <Square key={rowIndex * props.colNumber + colIndex} value={props.squares[rowIndex][colIndex]} />
                                })
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

class Threes extends React.Component {

    constructor(props) {
        super(props)
        const rowNumber = props.rowNumber ? props.rowNumber : 4,
              colNumber = props.colNumber ? props.colNumber : 4,
              squares = Array(rowNumber).fill(null).map(() => Array(colNumber).fill(null))
        squares[0][0] = 1
        this.state = {
            rowNumber,
            colNumber,
            squares
        }
    }

    handleKeyDown = event => {
        if (event.defaultPrevented) {
            return
        }
        switch (event.key) {
            case ArrowUp:
            case ArrowDown:
            case ArrowLeft:
            case ArrowRight:
                this.handleArrow(event.key)
                break
            default:
                return
        }
        event.preventDefault()
    }

    handleArrow(key) {
        const squares = this.state.squares,
              rowNumber = this.state.rowNumber,
              colNumber = this.state.colNumber
        let moved = false
        if (ArrowUp === key) {
            // ?????????????????????
            for (let colIndex = 0; colIndex < colNumber; colIndex++) {
                let moves = []
                for (let rowIndex = 0; rowIndex < rowNumber; rowIndex++) {
                    moves.push({ rowIndex, colIndex })
                }
                this.move(squares, moves) && (moved = true)
            }
        } else if (ArrowDown === key) {
            // ?????????????????????
            for (let colIndex = 0; colIndex < colNumber; colIndex++) {
                let moves = []
                for (let rowIndex = rowNumber - 1; rowIndex >= 0; rowIndex--) {
                    moves.push({ rowIndex, colIndex })
                }
                this.move(squares, moves) && (moved = true)
            }
        } else if (ArrowLeft === key) {
            // ?????????????????????
            for (let rowIndex = 0; rowIndex < rowNumber; rowIndex++) {
                let moves = []
                for (let colIndex = 0; colIndex < colNumber; colIndex++) {
                    moves.push({ rowIndex, colIndex })
                }
                this.move(squares, moves) && (moved = true)
            }
        } else if (ArrowRight === key) {
            // ?????????????????????
            for (let rowIndex = 0; rowIndex < rowNumber; rowIndex++) {
                let moves = []
                for (let colIndex = colNumber - 1; colIndex >= 0; colIndex--) {
                    moves.push({ rowIndex, colIndex })
                }
                this.move(squares, moves) && (moved = true)
            }
        }
        moved && this.fill(squares) && this.setState({ squares })
    }

    /**
     * ??????????????????????????????????????????????????????????????????????????????????????????
     * @param {Array} data ???????????????????????????????????????
     * @param {Array} moves ????????????????????????????????????
     */
    move(data, moves) {
        let values = [],    // ????????????????????????
            merged = false  // ?????????????????????
        for (let index = 0, length = moves.length; index < length; index++) {
            const { rowIndex, colIndex } = moves[index]
            let value = data[rowIndex][colIndex]
            if (!value) { // ????????????
                continue
            }
            if (merged || values.length === 0) { // ??????????????????????????????????????????????????????????????????
                values.push(value)
                continue
            }
            let lastIndex = values.length - 1,
                lastValue = values[lastIndex]
            if (lastValue !== value) { // ????????????????????????????????????
                values.push(value)
            } else { // ???????????????????????????????????????
                values[lastIndex] = lastValue + value
                merged = true
            }
        }
        // ?????????????????????????????????????????????????????????
        let moved = false
        const valueLength = values.length
        for (let index = 0, length = moves.length; index < length; index++) {
            const { rowIndex, colIndex } = moves[index],
                  originalValue = data[rowIndex][colIndex]
            let movedValue
            if (index < valueLength) {
                movedValue = values[index]
            } else {
                movedValue = null
            }
            data[rowIndex][colIndex] = movedValue
            moved || (moved = movedValue !== originalValue)
        }
        return moved
    }

    fill(data) {
        let nulls = [], minValue
        for (let rowIndex = 0, rowNumber = data.length; rowIndex < rowNumber; rowIndex++) {
            const row = data[rowIndex]
            for (let colIndex = 0, colNumber = row.length; colIndex < colNumber; colIndex++) {
                const value = row[colIndex]
                if (!value) {
                    nulls.push({ rowIndex, colIndex })
                } else {
                    minValue = !minValue ? value : (value < minValue ? value : minValue)
                }
            }
        }
        let nullLength = nulls.length, fillValue = 1,
            fill = nulls[Math.floor(Math.random() * nullLength)]
        if (nullLength <= 2) {
            fillValue = minValue
        }
        data[fill.rowIndex][fill.colIndex] = fillValue
        return true
    }

    render() {
        const squares = this.state.squares,
              rowNumber = this.state.rowNumber,
              colNumber = this.state.colNumber
        return (
            <div className='game'
                onKeyDown={this.handleKeyDown}
            >
                <Content
                    squares={squares}
                    rowNumber={rowNumber}
                    colNumber={colNumber}
                />
            </div>
        )
    }

}

export default Threes
