<?php

namespace Database\Factories\Concerns;

trait GeneratesSampleFiles
{
    /**
     * Writes a real (GD-rendered) placeholder JPEG to $path, so seeded
     * evidence entries have an actual viewable file behind them.
     */
    protected function makePlaceholderImage(string $path, string $label = 'Sample Evidence'): void
    {
        $image = imagecreatetruecolor(400, 300);
        $bg = imagecolorallocate($image, random_int(80, 220), random_int(80, 220), random_int(80, 220));
        imagefill($image, 0, 0, $bg);

        $textColor = imagecolorallocate($image, 20, 20, 20);
        imagestring($image, 5, 20, 140, $label, $textColor);

        imagejpeg($image, $path, 80);
        imagedestroy($image);
    }
}
