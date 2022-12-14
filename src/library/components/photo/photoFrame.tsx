import React, { Component } from 'react';
import {
  View,
  ViewStyle,
  Modal,
  TouchableWithoutFeedback,
  Image,
  Text,
} from 'react-native';

import RemoteImage from '@library/components/common/remoteImage';

import { Level } from '@library/models/level';
import { isAndroid } from '@library/services/deviceService';

import R, { Images } from '@res/R';
import { styles } from './photoFrame.style';
import { strings } from '@library/services/i18nService';

import { wp, hp, isTablet } from '@library/services/deviceService';
import ImageZoom from 'react-native-image-pan-zoom';

type Props = {
  level: Level;
  style?: ViewStyle;
  size: PhotoFrameSize;
};

export enum PhotoFrameSize {
  small,
  big,
}

const photoFrameConstant = 0.626373626373626;
const photoFramePicResizeConstant = 0.98;

// type State = {
//   modalVisible: boolean;
// };

export default class PhotoFrame extends Component<Props, any> {
  photoFrameWidth: number;
  photoFrameHeight: number;
  level: any;
  pic: any;
  state = { modalVisible: false, pic: {}, level: [] };

  constructor(props: Props) {
    super(props);
    this.level = this.props.level;

    if (this.props.size === PhotoFrameSize.small) {
      this.photoFrameWidth = isTablet() ? hp('35%') : wp('68%');
    } else {
      this.photoFrameWidth = isTablet()
        ? wp('70%')
        : isAndroid
          ? wp('75%')
          : wp('85%');
    }
    this.photoFrameHeight = this.photoFrameWidth * photoFrameConstant;
  }
  componentDidMount(): void {
    this.setState({
      level: this.props.level,
      pic: {
        uri:
          this.props.level.urlPhoto
      }
    })
  }
  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<any>, snapshot?: any): void {
    if (prevProps.level != this.props.level) {
      // console.log(this.props.level);
      this.setState({
        level: this.props.level,
        pic: {
          uri: this.props.level.urlPhoto
        }
      })
    }
  }

  render() {
    const picName = 'level_' + this.props.level.id.toString();

    // const pic = {
    //   uri:
    //     'https://tegami-mountains-content.s3-eu-west-1.amazonaws.com/' +
    //     picName +
    //     '@2x.jpg',
    // };

    // const pic = {
    //   uri:
    //     this.props.level.urlPhoto
    // };
    // console.log(this.state.pic);

    const width = wp('100%');
    const constant = 0.626373626373626;
    const height = width * constant;

    return (
      <View style={this.props.style}>
        <Image
          style={Object.assign(
            {
              width: this.photoFrameWidth * photoFramePicResizeConstant,
              height: this.photoFrameHeight * photoFramePicResizeConstant,
            },
            styles.levelDetailsImagePic,
          )}
          source={this.state.pic}
        // showNativeIndicator={false}
        />
        <TouchableWithoutFeedback
          onPress={() => {
            this.setState({ modalVisible: true });
          }}>
          <Image
            style={Object.assign(
              {
                width: this.photoFrameWidth,
                height: this.photoFrameHeight,
              },
              styles.levelDetailsImageFrame,
            )}
            source={R.img(Images.photo_frame)}
          />
        </TouchableWithoutFeedback>

        <Modal
          animationType="fade"
          visible={this.state.modalVisible}
          transparent={true}>
          <Text style={styles.sourcePhoto}>
            {strings('sourcePhoto') + ': ' + this.props.level.sourcePhoto}
          </Text>

          <TouchableWithoutFeedback onPress={() => { this.setState({ modalVisible: false }); }}>
            <Text style={styles.close}>{strings('close')}</Text>
          </TouchableWithoutFeedback>
          <View style={styles.modal}>
            <ImageZoom
              enableSwipeDown
              onSwipeDown={() => {
                this.setState({ modalVisible: false });
              }}
              useNativeDriver
              cropWidth={wp('100%')}
              cropHeight={hp('100%')}
              imageWidth={width}
              imageHeight={height}>
              <RemoteImage
                style={{ width, height }}
                source={this.state.pic}
                showNativeIndicator={true}
              />
            </ImageZoom>
          </View>
        </Modal>
      </View>
    );
  }
}
