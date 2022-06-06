// @flow

import * as React from 'react'
import {
  G,
  Rect,
  Text as SvgText,
} from 'react-native-svg'

import { Log } from '../../Common/Log'

const PIE_CHART_LABEL_LETTER_SPACING = 3
const PIE_CHART_LABEL_WIDTH = 45
const PIE_CHART_LABEL_HEIGHT = 20
const PIE_CHART_LABEL_BORDER_RADIUS = 5
const PIE_CHART_LABEL_FONT_SIZE = 14

type PieChartSlice = {
  data: {
    key: string,
    label: string,
    svg: {
      fill: string, // Color HEX
      onPress: () => void,
    },
    value: number,
  },
  endAngle: number,
  index: 1,
  labelCentroid: [ number, number ],
  padAngle: number,
  pieCentroid: [ number, number ],
  startAngle: number,
  value: number,
}

type Props = {
  height?: number,
  slices?: PieChartSlice[],
  width?: number,
}

const log = new Log('Dashboard.Components.DashboardComponent.PieChartLabels')

function calculateVerticalOffset (y: number, height: number) {
  const yAxisCompensation = height / 2
  const yShifted = y + yAxisCompensation

  return -1 * PIE_CHART_LABEL_HEIGHT * (yShifted / height) + 1
}

const sortSlices = (sliceA: PieChartSlice, sliceB: PieChartSlice) => sliceA.startAngle > sliceB.startAngle
  ? 1
  : sliceA.startAngle < sliceB.startAngle
    ? -1
    : 0

type LabelProps = {
  data: $PropertyType<PieChartSlice, 'data'>,
  labelCentroid: $PropertyType<PieChartSlice, 'labelCentroid'>,
  middleAngle: number,
  rect: { x: number, y: number },
  text: { x: number, y: number },
}

function calculateMiddleAngle (startAngle: number, endAngle: number) {
  return startAngle + (endAngle - startAngle) / 2
}

function filterInsignificantSlices (slice: PieChartSlice) {
  const { endAngle, startAngle } = slice

  return calculateMiddleAngle(startAngle, endAngle) <= 6.4
}

const mapSliceToLabelPropsFactory = (height: number, width: number) => (slice: PieChartSlice, index: number): LabelProps => {
  const { endAngle, labelCentroid, startAngle } = slice

  log.debug('PieChartLabels:renderDecorator', {
    slice,
    width,
    labelCentroid,
  })

  const middleAngle = calculateMiddleAngle(startAngle, endAngle)

  const x = labelCentroid[0] <= 0 ? labelCentroid[0] - PIE_CHART_LABEL_WIDTH : labelCentroid[0]
  const y = labelCentroid[1]
  const verticalOffset = calculateVerticalOffset(y, height)
  const horizontalOffset = labelCentroid[0] <= 0
    ? -Math.abs(Math.cos(middleAngle)) * PIE_CHART_LABEL_WIDTH
    : 0
  const horizontalOffsetText = -PIE_CHART_LABEL_LETTER_SPACING

  return {
    data: slice.data,
    labelCentroid,
    middleAngle,
    rect: {
      x: x + horizontalOffset,
      y: y + verticalOffset,
    },
    text: {
      x: x + PIE_CHART_LABEL_WIDTH / 2 + horizontalOffset + horizontalOffsetText,
      y: y + verticalOffset + PIE_CHART_LABEL_FONT_SIZE,
    },
  }
}

export function PieChartLabels ({ height = 0, slices, width = 0 }: Props) {
  const sortedSlices = slices ? slices.sort(sortSlices).filter(filterInsignificantSlices) : null

  const labelsFirstPass = sortedSlices && height && width
    ? sortedSlices.map<LabelProps>/* comment fixes syntaxt </LabelProps> */(mapSliceToLabelPropsFactory(height, width)) // i18n-ignore
    : null

  log.log('PieChartLabels:labelsFirstPass', labelsFirstPass)

  let nextY: ?number = null

  const labels = labelsFirstPass
    ? labelsFirstPass.reverse().map((label: LabelProps, index: number) => {
      if (label.rect.x >= 0) {
        return label
      }

      let offsetY: number = 0
      const offsetX: number = label.rect.x + width / 2

      if (!nextY) {
        offsetY = -height / 2 - label.rect.y
      } else if (label.rect.y < nextY) {
        offsetY = nextY - label.rect.y
      }

      if (offsetY !== 0) {
        label.rect.y += offsetY
        label.text.y += offsetY
      }

      if (offsetX < 0) {
        label.rect.x -= offsetX
        label.text.x -= offsetX
      }

      nextY = label.rect.y + PIE_CHART_LABEL_HEIGHT + 1

      return label
    })
    : null

  log.log('PieChartLabels:labels', labels)

  return labels
    ? labels.map<?G>((label, index: number) => {
      const { data, labelCentroid, middleAngle, rect, text } = label

      return data.label
        ? <G key={data.key + JSON.stringify(labelCentroid)}>
          <Rect
            fill={data.svg.fill}
            height={PIE_CHART_LABEL_HEIGHT}
            middleAngle={middleAngle}
            rx={PIE_CHART_LABEL_BORDER_RADIUS}
            // x={labelCentroid[0] - PIE_CHART_LABEL_WIDTH / 2}
            width={PIE_CHART_LABEL_WIDTH}
            x={rect.x}
            y={rect.y}
          />
          <SvgText
            fill='#3600A2'
            fontFamily='WorkSans-Black'
            fontSize={PIE_CHART_LABEL_FONT_SIZE}
            fontWeight='900'
            letterSpacing={PIE_CHART_LABEL_LETTER_SPACING.toString()}
            // x={labelCentroid[0] - PIE_CHART_LABEL_LETTER_SPACING}
            textAnchor='middle'
            x={text.x}
            y={text.y}
          >
            {data.label}
          </SvgText>
        </G>
        : null
    })
    : null
}
