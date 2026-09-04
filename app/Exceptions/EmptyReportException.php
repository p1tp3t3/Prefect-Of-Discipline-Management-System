<?php

namespace App\Exceptions;

/**
 * Thrown by GenerateReportJob when the selected filters matched zero
 * records — an expected outcome (not a bug), so it's reported to the
 * user with its own message instead of the generic failure one and isn't
 * logged as an error.
 */
class EmptyReportException extends \RuntimeException
{
}
