<?php
declare(strict_types=1);

namespace Elsnertech\DisableSri\Plugin;

use Magento\Csp\Model\SubresourceIntegrity\SriEnabledActions;

class DisableSriForCheckout
{
    private const DISABLED_ACTIONS = [
        'checkout_index_index',
    ];

    /**
     * Disable SRI on checkout to avoid integrity mismatches during local/theme development.
     *
     * @param SriEnabledActions $subject
     * @param bool $result
     * @param string $actionName
     * @return bool
     * @SuppressWarnings(PHPMD.UnusedFormalParameter)
     */
    public function afterIsPaymentPageAction(
        SriEnabledActions $subject,
        bool $result,
        string $actionName
    ): bool {
        if (in_array($actionName, self::DISABLED_ACTIONS, true)) {
            return false;
        }

        return $result;
    }
}

