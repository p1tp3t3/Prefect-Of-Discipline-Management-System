<?php

namespace App\Http\Controllers\Resource;

use App\Http\Controllers\Controller;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpWord\Settings;
use PhpOffice\PhpWord\TemplateProcessor;
use ZipArchive;

class FileController extends Controller
{
    public function getDocument($type, $username, $fileName)
    {
        $path = self::getUserAssets($username, $type);
        $file = "$path/$fileName";

        if (!file_exists($file)) {
            abort(404);
        };

        $mime = mime_content_type($file);
        return response()->file($file, ['Content-Type' => $mime]);
    }
    public function getProfilePicture()
    {
        $decrypt = self::cryptoJsAesDecrypt($_GET['ref']);
        $path = storage_path("app/private/user-assets/$decrypt/profile-$decrypt.jpg");

        if (!file_exists($path)) {
            abort(404);
        }

        $mimeType = mime_content_type($path);

        return response()->file($path, [
            'Content-Type' => $mimeType,
        ]);
    }
    public function getUserAssets($username, $type) {
        $userFolder = storage_path("app/private/user-assets/$username");
        switch($type) {
            case 'complaint':
                return "$userFolder/complaint";
            case 'gatepass':
                return "$userFolder/gatepass";
            case 'profile':
                return "$userFolder/profile";
        }
    }
    public function downloadAccountFile($fileName) {
        $filePath = Storage::disk('local')->path("zips/$fileName");
        return response()->download($filePath);
    }

    private function addFolderToZip($folder, $zip, $parentFolder = '') {
        $files = scandir($folder);
        foreach ($files as $file) {
            if ($file === '.' || $file === '..') continue;

            $filePath = "$folder/$file";
            $localPath = $parentFolder ? "$parentFolder/$file" : $file;

            if (is_dir($filePath)) {
                $zip->addEmptyDir($localPath);
                self::addFolderToZip($filePath, $zip, $localPath);
            } else {
                $zip->addFile($filePath, $localPath);
            }
        }
    } 
    public function getUserAccountZipFileList() {
        $files = Storage::disk('local')->files('zips');
        $csvFiles = array_filter($files, function($file) {
            $fileInfo = pathinfo($file, PATHINFO_EXTENSION);

            return $fileInfo === 'zip' || $fileInfo === 'csv';
        });

        $fileDetails = array_map(function($file) {
            return [
                'name' => basename($file),
                'path' => $file,
                'size' => Storage::disk('local')->size($file),
                'last_modified' => date("F d Y H:i:s", Storage::disk('local')->lastModified($file)),
            ];
        }, $csvFiles);

        return response()->json(array_values($fileDetails));
    }
    public function generatePDFEvidence($fileName, $placeHolderList, $output) {

        $caseNumber = $placeHolderList['case-number'];

        if($placeHolderList['image_block']) {
            $data = [ 
                'case_number' => $caseNumber,
                'img_list' => $placeHolderList['image_block']
            ];
            $pdf = Pdf::loadView('pdf.evidence', $data);
            $p = str_replace('.docx', '.pdf', $output);

            $pdf->download("$fileName.pdf");
            $pdf->save($p);
        }
    }
    public function generateDocx($templatePath, $output, $placeHolderList) {
        $template = new TemplateProcessor($templatePath);
        
        foreach($placeHolderList as $key => $plc) {
            if($plc != null) {
                $template->setValue($key, $plc);
            }
        }

        $template->saveAs($output);
        response()->download($output);

        return response()->json(['status' => 'success']);
    }
    public function printFile($filePath) {
        $pdfPath = str_replace('.docx', '.pdf', $filePath);

        Settings::setPdfRendererName(Settings::PDF_RENDERER_DOMPDF);
        Settings::setPdfRendererPath(base_path('vendor/dompdf/dompdf'));

        $phpWord = \PhpOffice\PhpWord\IOFactory::load($filePath);
        $pdfWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'PDF');
        $pdfWriter->save($pdfPath);

        return response()->file($pdfPath);
    }
    public function generatePDF($type = '', $view = '', $fileName = '', $placeHolderList = [], $output = '') {
        if($type == 'evidence') {
            if($placeHolderList['image_block']) {
                $caseNumber = $placeHolderList['id'];

                $data = [ 
                    'case_number' => $caseNumber,
                    'img_list' => $placeHolderList['image_block']
                ];
                $pdf = Pdf::loadView('pdf.evidence', $data);
            }else {
                $pdf = Pdf::loadView("pdf.$view", $placeHolderList);
            }
        }
        $p = str_replace('.docx', '.pdf', $output);

        $pdf->download("$fileName.pdf");
        $pdf->save($p);

        return response()->json(['status' => 'success']);
    }

    public function destroy() {
        $fileName = request()->fileName;
        $filePath = "zips/$fileName";

        if (Storage::disk('local')->exists($filePath)) {
            Storage::disk('local')->delete($filePath);
            
            return self::getUserAccountZipFileList();
        } else {
            return response()->json(['message' => 'File not found.'], 404);
        }
    }

    public function cryptoJsAesDecrypt($jsonString) {
        $data = base64_decode($jsonString);

        // Check for OpenSSL-style salt prefix ("Salted__")
        $salted = substr($data, 0, 8) === "Salted__";
        $salt = $salted ? substr($data, 8, 8) : null;
        $ciphertext = $salted ? substr($data, 16) : $data;

        if ($salted && $salt) {
            $keyIv = self::evpBytesToKey($salt);
            $key = $keyIv['key'];
            $iv = $keyIv['iv'];

            $decrypted = openssl_decrypt(
                $ciphertext,
                'AES-256-CBC',
                $key,
                OPENSSL_RAW_DATA,
                $iv
            );

            return $decrypted;
        }

        return false;
    }

    public function evpBytesToKey($salt, $keyLen = 32, $ivLen = 16) {
        $dtot = '';
        $d = '';
        while (strlen($dtot) < ($keyLen + $ivLen)) {
            $d = md5($d . 'gh4mdvcf' . $salt, true);
            $dtot .= $d;
        }
        return [
            'key' => substr($dtot, 0, $keyLen),
            'iv'  => substr($dtot, $keyLen, $ivLen)
        ];
    }
    
}