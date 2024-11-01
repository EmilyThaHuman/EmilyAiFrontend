// import { useFocusRing } from '@react-aria/focus';
// import { useHover } from '@react-aria/interactions';
// import { mergeProps } from '@react-aria/utils';
// import { useMemo, useCallback } from 'react';

// import { useAvatarGroupContext } from './avatar-group-context';

// export function useAvatar(originalProps = {}) {
//   const globalContext = useProviderContext();
//   const groupContext = useAvatarGroupContext();
//   const isInGroup = !!groupContext;

//   const {
//     as,
//     ref,
//     src,
//     name,
//     icon,
//     classNames,
//     fallback,
//     alt = name || 'avatar',
//     imgRef: imgRefProp,
//     color = groupContext?.color ?? 'default',
//     radius = groupContext?.radius ?? 'full',
//     size = groupContext?.size ?? 'md',
//     isBordered = groupContext?.isBordered ?? false,
//     isDisabled = groupContext?.isDisabled ?? false,
//     isFocusable = false,
//     getInitials = safeText,
//     ignoreFallback = false,
//     showFallback: showFallbackProp = false,
//     ImgComponent = 'img',
//     imgProps,
//     className,
//     onError,
//     ...otherProps
//   } = originalProps;

//   const Component = as || 'span';

//   const domRef = useDOMRef(ref);
//   const imgRef = useDOMRef(imgRefProp);

//   const { isFocusVisible, isFocused, focusProps } = useFocusRing();
//   const { isHovered, hoverProps } = useHover({ isDisabled });
//   const disableAnimation =
//     originalProps.disableAnimation ?? globalContext?.disableAnimation ?? false;

//   const imageStatus = useImage({ src, onError, ignoreFallback });
//   const isImgLoaded = imageStatus === 'loaded';
//   const shouldFilterDOMProps = typeof ImgComponent === 'string';

//   const showFallback = (!src || !isImgLoaded) && showFallbackProp;

//   const slots = useMemo(
//     () =>
//       avatar({
//         color,
//         radius,
//         size,
//         isBordered,
//         isDisabled,
//         isInGroup,
//         disableAnimation,
//         isInGridGroup: groupContext?.isGrid ?? false,
//       }),
//     [
//       color,
//       radius,
//       size,
//       isBordered,
//       isDisabled,
//       disableAnimation,
//       isInGroup,
//       groupContext?.isGrid,
//     ]
//   );

//   const baseStyles = clsx(classNames?.base, className);

//   const canBeFocused = useMemo(() => {
//     return isFocusable || as === 'button';
//   }, [isFocusable, as]);

//   const getAvatarProps = useCallback(
//     (props = {}) => ({
//       ref: domRef,
//       tabIndex: canBeFocused ? 0 : -1,
//       'data-hover': dataAttr(isHovered),
//       'data-focus': dataAttr(isFocused),
//       'data-focus-visible': dataAttr(isFocusVisible),
//       className: slots.base({
//         class: clsx(baseStyles, props?.className),
//       }),
//       ...mergeProps(otherProps, hoverProps, canBeFocused ? focusProps : {}),
//     }),
//     [canBeFocused, slots, baseStyles, focusProps, otherProps]
//   );

//   const getImageProps = useCallback(
//     (props = {}) => ({
//       ref: imgRef,
//       src: src,
//       'data-loaded': dataAttr(isImgLoaded),
//       className: slots.img({ class: classNames?.img }),
//       ...mergeProps(
//         imgProps,
//         props,
//         filterDOMProps(
//           { disableAnimation },
//           {
//             enabled: shouldFilterDOMProps,
//           }
//         )
//       ),
//     }),
//     [
//       imgRef,
//       src,
//       isImgLoaded,
//       slots,
//       classNames?.img,
//       imgProps,
//       disableAnimation,
//       shouldFilterDOMProps,
//     ]
//   );

//   return {
//     Component,
//     ImgComponent,
//     src,
//     alt,
//     icon,
//     name,
//     imgRef,
//     slots,
//     classNames,
//     fallback,
//     isImgLoaded,
//     showFallback,
//     ignoreFallback,
//     getInitials,
//     getAvatarProps,
//     getImageProps,
//   };
// }
