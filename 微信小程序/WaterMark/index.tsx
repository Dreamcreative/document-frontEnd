import Taro, { Component } from "@tarojs/taro";
import "./index.scss";
import { connect } from "@tarojs/redux";
import { View } from "@tarojs/components";
import config from "@/common/config";

export interface WaterMarkProps {}

export interface WaterMarkState {
  text: string;
  backgroundImg: string;
}
@connect(({ home }) => ({
  ...home
}))
export default class WaterMark extends Component<
  WaterMarkProps,
  WaterMarkState
> {
  state = {
    backgroundImg: "",
    text: ""
  };
  static defaultProps = {};
  WaterRemark() {
    const _this = this;
    const { text } = this.state;
    const drawTitle = text;
    // 获取画布，需要传入当前组件 this
    const ctx = Taro.createCanvasContext("waterMarkCanvas", _this);
    ctx.rotate(-0.2);
    ctx.setFillStyle("rgba(188, 188, 188, 0.3)");

    ctx.setFontSize(9);
    ctx.fillText(drawTitle, 0, 100);
    ctx.fillText(drawTitle, 20, 360);
    // 转换图片需要在 ctx.draw 方法中调用
    ctx.draw(false, () => {
      setTimeout(() => {
        wx.canvasToTempFilePath(
          {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            canvasId: "waterMarkCanvas",
            success: async function(res) {
              const { tempFilePath } = res;
              _this.setState({
                backgroundImg: tempFilePath
              });
            }
          },
          // 这里不传 this,或者传入 this 会报 canvasToTempFilePath: fail canvas is empty; 错误
          this.$scope
        );
      }, 500);
    });
  }
  componentDidMount() {
    const userInfo = Taro.getStorageSync(config.storage.userInfo);
    if (userInfo) {
      const { nickName, phone } = JSON.parse(userInfo || "{}");
      // 手机号中间4位 替换
      // phone.replace(/^(\d{3})(\d{4})(\d{4})$/, "$1****$3");
      this.setState(
        {
          text: `${nickName}${phone}`
        },
        () => {
          this.WaterRemark();
        }
      );
    }
  }

  render() {
    const { backgroundImg } = this.state;
    const imageLengthArr = new Array(4).fill("");
    return (
      <View className="watermark">
        <View style={{ display: backgroundImg ? "none" : "" }}>
          <canvas className={"canvas"} canvas-id="waterMarkCanvas" />
        </View>
        <View className="watermark-img__box">
          {imageLengthArr.map(() => {
            return <Image className="watermark-img" src={backgroundImg} />;
          })}
        </View>
        {/* 在 IOS 机型下，wx.canvasToTempFilePath()生成的图片无法作为背景被渲染，所以使用 image 标签来作为替代方案 */}
        {/* <View
          className="watermark-box"
          style={{
            backgroundImage: `url(${backgroundImg})`
          }}
        ></View> */}
      </View>
    );
  }
}
