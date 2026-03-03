# 图片优化指南

## 概述

本项目已添加响应式图片组件，可在不同屏幕尺寸下加载不同分辨率的图片，并支持懒加载功能。

## 组件使用

### 1. ResponsiveImage - 响应式图片组件

```tsx
import { ResponsiveImage } from '@/components/ResponsiveImage';

// 基本用法 - 带懒加载
<ResponsiveImage 
  src="/image-lg.jpg"
  srcSm="/image-sm.jpg"
  srcMd="/image-md.jpg"
  srcLg="/image-lg.jpg"
  srcXl="/image-xl.jpg"
  alt="描述文字"
  className="w-full h-64"
  aspectRatio="video"
/>

// 不使用懒加载
<ResponsiveImage 
  src="/image.jpg"
  alt="描述文字"
  lazy={false}
/>

// 使用占位符
<ResponsiveImage 
  src="/image.jpg"
  placeholder="/placeholder.jpg"
  alt="描述文字"
/>
```

### 2. LazyImage - 简单懒加载

```tsx
import { LazyImage } from '@/components/ResponsiveImage';

<LazyImage 
  src="/image.jpg" 
  alt="描述文字"
  className="w-full h-64 object-cover"
  threshold={0.1}
  rootMargin="100px"
/>
```

### 3. BackgroundImage - 背景图片

```tsx
import { BackgroundImage } from '@/components/ResponsiveImage';

<BackgroundImage 
  src="/bg.jpg"
  srcSm="/bg-sm.jpg"
  srcMd="/bg-md.jpg"
  className="min-h-screen"
>
  <div className="content">...</div>
</BackgroundImage>
```

## 属性说明

### ResponsiveImage

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| src | string | - | 默认图片路径 |
| srcSm | string | - | 640px 及以下 |
| srcMd | string | - | 768px 及以下 |
| srcLg | string | - | 1024px 及以下 |
| srcXl | string | - | 1280px 及以下 |
| alt | string | - | 图片描述（必需） |
| aspectRatio | 'auto' \| 'square' \| 'video' \| 'portrait' \| 'wide' | 'auto' | 宽高比 |
| lazy | boolean | true | 是否懒加载 |
| placeholder | string | - | 占位符图片 |
| objectFit | 'cover' \| 'contain' \| 'fill' \| 'none' \| 'scale-down' | 'cover' | 图片填充方式 |

## WebP 格式支持

项目支持 WebP 格式图片。使用方式：

```tsx
// 自动回退：浏览器会自动选择支持的格式
<ResponsiveImage 
  src="/image.webp"
  srcSm="/image-sm.webp"
  srcMd="/image-md.webp"
  srcLg="/image-lg.webp"
  srcXl="/image-xl.webp"
  alt="描述文字"
/>
```

## 将现有图片替换为响应式图片

### Before:
```tsx
<img 
  src="/hero-woman.jpg" 
  alt="Professional" 
  className="w-full h-auto object-cover"
/>
```

### After:
```tsx
<ResponsiveImage 
  src="/hero-woman.jpg"
  srcSm="/hero-woman-sm.jpg"
  srcMd="/hero-woman-md.jpg"
  srcLg="/hero-woman-lg.jpg"
  alt="Professional" 
  className="w-full h-auto"
  aspectRatio="video"
  lazy={true}
/>
```

## 推荐的图片尺寸

| 断点 | 尺寸 |
|------|------|
| sm (640px) | 640w |
| md (768px) | 768w |
| lg (1024px) | 1024w |
| xl (1280px) | 1280w |
| 2xl (1536px) | 1920w |

## Tailwind 工具类

新增的工具类：

- `aspect-auto` - 自动宽高比
- `aspect-square` - 1:1 宽高比
- `aspect-video` - 16:9 宽高比
- `aspect-portrait` - 3:4 宽高比
- `aspect-wide` - 21:9 宽高比