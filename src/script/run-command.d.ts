import type { CallbackData, ConvertOption, FileInfo } from "../common/types";

/**
 * Handle file change event and process file information
 * @param fileUrl - The URL of the file to process
 */
export async function run_get_info(fileUrl: string): Promise<FileInfo>;

export function run_cancel_convert(): void;

export async function run_Convert_File_With_Options_New(inputOptions: ConvertOption, defaultOptions?: ConvertOption): Promise<void>;

export function run_clear_data(): void;

export function run_on_event(callback: (name: string, data: CallbackData) => void): void;
