// Extra small screen / phone
export const SCREEN_SS =							320
export const SCREEN_SS_MIN =						SCREEN_SS

// Extra small screen / phone
export const SCREEN_XS =							480
export const SCREEN_XS_MIN =						SCREEN_XS

// Small screen / tablet
export const SCREEN_SM =							768
export const SCREEN_SM_MIN =						SCREEN_SM

// Medium screen / desktop
export const SCREEN_MD =							992
export const SCREEN_MD_MIN =						SCREEN_MD

// Large screen / wide desktop
export const SCREEN_LG =							1270
export const SCREEN_LG_MIN =						SCREEN_LG

// So media queries don't overlap when required, provide a maximum
export const SCREEN_SS_MAX =						(SCREEN_XS_MIN - 1)
export const SCREEN_XS_MAX =						(SCREEN_SM_MIN - 1)
export const SCREEN_SM_MAX =						(SCREEN_MD_MIN - 1)
export const SCREEN_MD_MAX =						(SCREEN_LG_MIN - 1)

export const Size = 
{
	SS: 1,
	XS: 2,
	SM: 3,
	MD: 4,
	LG: 5,
}

export const Orientation = 
{
	Landscape: "landscape",
	Portrait: "portrait",
}

export function calculateSize(width, height) {
	if (width >= SCREEN_LG)
		return Size.LG

	if (width >= SCREEN_MD)
		return Size.MD

	if (width >= SCREEN_SM)
		return Size.SM

	if (width >= SCREEN_XS)
		return Size.XS

	return Size.SS
}
