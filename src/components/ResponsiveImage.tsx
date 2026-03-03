import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'sizes'> {
  src: string;
  srcSm?: string;
  srcMd?: string;
  srcLg?: string;
  srcXl?: string;
  alt: string;
  aspectRatio?: 'auto' | 'square' | 'video' | 'portrait' | 'wide';
  lazy?: boolean;
  placeholder?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

/**
 * 响应式图片组件
 * - 支持不同屏幕尺寸加载不同分辨率的图片
 * - 支持懒加载
 * - 支持占位符
 * - 支持多种宽高比
 */
export function ResponsiveImage({
  src,
  srcSm,
  srcMd,
  srcLg,
  srcXl,
  alt,
  aspectRatio = 'auto',
  lazy = true,
  placeholder,
  objectFit = 'cover',
  className,
  ...props
}: ResponsiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef<HTMLImageElement>(null);

  // 构建 srcSet
  const buildSrcSet = () => {
    const sources: string[] = [];
    if (srcSm) sources.push(`${srcSm} 640w`);
    if (srcMd) sources.push(`${srcMd} 768w`);
    if (srcLg) sources.push(`${srcLg} 1024w`);
    if (srcXl) sources.push(`${srcXl} 1280w`);
    if (src && !srcSm) sources.push(`${src} 1920w`);
    return sources.join(', ');
  };

  // 构建 sizes
  const buildSizes = () => {
    if (srcSm || srcMd || srcLg || srcXl) {
      return '(max-width: 640px) 640px, (max-width: 768px) 768px, (max-width: 1024px) 1024px, (max-width: 1280px) 1280px, 1920px';
    }
    return undefined;
  };

  // 懒加载观察器
  useEffect(() => {
    if (!lazy || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, isInView]);

  // 宽高比样式
  const aspectRatioStyles = {
    auto: {},
    square: { aspectRatio: '1 / 1' },
    video: { aspectRatio: '16 / 9' },
    portrait: { aspectRatio: '3 / 4' },
    wide: { aspectRatio: '21 / 9' },
  };

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={aspectRatio !== 'auto' ? aspectRatioStyles[aspectRatio] : undefined}
    >
      {/* 占位符 */}
      {placeholder && !isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <img
            src={placeholder}
            alt=""
            className="w-full h-full object-cover opacity-50"
            aria-hidden="true"
          />
        </div>
      )}

      {/* 实际图片 */}
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          srcSet={buildSrcSet() || undefined}
          sizes={buildSizes()}
          alt={alt}
          className={cn(
            'transition-opacity duration-500',
            isLoaded ? 'opacity-100' : 'opacity-0',
            objectFit === 'cover' && 'object-cover',
            objectFit === 'contain' && 'object-contain',
            objectFit === 'fill' && 'object-fill',
            objectFit === 'none' && 'object-none',
            objectFit === 'scale-down' && 'object-scale-down'
          )}
          loading={lazy ? 'lazy' : 'eager'}
          onLoad={() => setIsLoaded(true)}
          {...props}
        />
      )}
    </div>
  );
}

/**
 * 懒加载图片组件 - 简单的懒加载包装器
 */
interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  threshold?: number;
  rootMargin?: string;
}

export function LazyImage({
  threshold = 0.1,
  rootMargin = '100px',
  className,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <img
      ref={imgRef}
      className={cn(
        'transition-opacity duration-300',
        isLoaded ? 'opacity-100' : 'opacity-0',
        className
      )}
      loading="lazy"
      onLoad={() => setIsLoaded(true)}
      {...props}
    />
  );
}

/**
 * 背景图片组件 - 支持响应式和懒加载
 */
interface BackgroundImageProps {
  src: string;
  srcSm?: string;
  srcMd?: string;
  srcLg?: string;
  srcXl?: string;
  alt?: string;
  className?: string;
  children?: React.ReactNode;
}

export function BackgroundImage({
  src,
  srcSm,
  srcMd,
  srcLg,
  srcXl,
  alt = '',
  className,
  children,
}: BackgroundImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // 构建媒体查询
  const getBackgroundImage = () => {
    const images = [
      srcXl && `(max-width: 1280px) ${srcXl}`,
      srcLg && `(max-width: 1024px) ${srcLg}`,
      srcMd && `(max-width: 768px) ${srcMd}`,
      srcSm && `(max-width: 640px) ${srcSm}`,
      src,
    ].filter(Boolean);

    if (images.length === 0) return `url(${src})`;

    return `
      url(${srcXl || src}) 1920w,
      url(${srcLg || src}) 1280w,
      url(${srcMd || src}) 768w,
      url(${srcSm || src}) 640w
    `;
  };

  return (
    <div
      className={cn('relative bg-cover bg-center bg-no-repeat', className)}
      style={{
        backgroundImage: isLoaded ? getBackgroundImage() : undefined,
        backgroundSize: 'cover',
      }}
    >
      {children}
      {isLoaded && (
        <img
          src={src}
          alt={alt}
          className="hidden"
          onLoad={() => setIsLoaded(true)}
        />
      )}
      {!isLoaded && (
        <img
          src={src}
          alt=""
          className="hidden"
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
}

export default ResponsiveImage;