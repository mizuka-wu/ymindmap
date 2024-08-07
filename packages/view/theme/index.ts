import type { Theme } from "@ymindmap/model";
export const theme: Theme = {
  background: "#f6f6f7",
  thumbUrl: "./assets/images/mind/mr.png",
  title: "默认风格",
  startType: [],
  marginH: 26,
  marginW: 80,
  childMarginH: 8,
  childMarginW: 12,
  common: {
    family: "微软雅黑",
    bold: false,
    italic: false,
    textAlign: "left",
  },
  connectionStyle: {
    lineWidth: 2,
    lineColor: "rgb(113, 203, 45)",
    color: "#ffffff",
  },
  centerTopic: {
    backgroundColor: "#50C28B",
    color: "#fff",
    fontSize: 25,
    borderRadius: 5,
    padding: [14, 12, 14, 12],
  },
  subTopic: {
    backgroundColor: "#ffffff",
    border: "1px solid rgb(187,187,187)",
    borderRadius: 5,
    color: "rgb(68,68,68)",
    fontSize: 17,
    padding: 10,
    lineStyle: {
      lineType: "curve",
      lineWidth: 1,
      lineColor: "rgb(170,170,170)",
    },
  },
  childTopic: {
    fontSize: 13,
    color: "rgb(68,68,68)",
    padding: [2, 8, 2, 8],
    lineStyle: {
      lineType: "roundBroken",
      lineWidth: 1,
      lineColor: "rgb(140,140,140)",
    },
  },
}
export default theme;