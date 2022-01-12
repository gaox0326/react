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
            // 每一列向上移动
            for (let colIndex = 0; colIndex < colNumber; colIndex++) {
                let moves = []
                for (let rowIndex = 0; rowIndex < rowNumber; rowIndex++) {
                    moves.push({ rowIndex, colIndex })
                }
                this.move(squares, moves) && (moved = true)
            }
        } else if (ArrowDown === key) {
            // 每一列向下移动
            for (let colIndex = 0; colIndex < colNumber; colIndex++) {
                let moves = []
                for (let rowIndex = rowNumber - 1; rowIndex >= 0; rowIndex--) {
                    moves.push({ rowIndex, colIndex })
                }
                this.move(squares, moves) && (moved = true)
            }
        } else if (ArrowLeft === key) {
            // 每一行向左移动
            for (let rowIndex = 0; rowIndex < rowNumber; rowIndex++) {
                let moves = []
                for (let colIndex = 0; colIndex < colNumber; colIndex++) {
                    moves.push({ rowIndex, colIndex })
                }
                this.move(squares, moves) && (moved = true)
            }
        } else if (ArrowRight === key) {
            // 每一行向右移动
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
     * 移动数据，过滤空值，合并第一次出现的、值相同的、相邻两项数据
     * @param {Array} data 要处理的原始数据，二维数据
     * @param {Array} moves 要处理的数据行列索引列表
     */
    move(data, moves) {
        let values = [],    // 移动后的数据列表
            merged = false  // 是否进行过合并
        for (let index = 0, length = moves.length; index < length; index++) {
            const { rowIndex, colIndex } = moves[index]
            let value = data[rowIndex][colIndex]
            if (!value) { // 过滤空值
                continue
            }
            if (merged || values.length === 0) { // 已经合并过，或者第一项数据，直接放入结果列表
                values.push(value)
                continue
            }
            let lastIndex = values.length - 1,
                lastValue = values[lastIndex]
            if (lastValue !== value) { // 值不同，直接放入结果列表
                values.push(value)
            } else { // 值相同，合并值到前一项数据
                values[lastIndex] = lastValue + value
                merged = true
            }
        }
        // 将移动后的数据列表，重新赋值到原始数据
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
