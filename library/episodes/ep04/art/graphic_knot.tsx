import React from 'react';

/**
 * Close-up of the shroud's head knot, frame coords (1080x1920).
 * White cloth gathered above the head, cinched with a cloth tie, twisted tuft flaring on top.
 * Key/rim light from the right; sw = sway (-1..1) of the loose cloth ends.
 */
export const ShroudKnot: React.FC<{ sw: number }> = ({ sw }) => {
  const s = sw * 10;
  return (
    <g>
      <defs>
        <linearGradient id="gk-cloth" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#14161d" />
          <stop offset="0.3" stopColor="#4e5462" />
          <stop offset="0.6" stopColor="#9aa0b0" />
          <stop offset="0.82" stopColor="#e9e4d6" />
          <stop offset="0.94" stopColor="#f7f4ec" />
          <stop offset="1" stopColor="#b9bfcc" />
        </linearGradient>
        <linearGradient id="gk-down" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity={0} />
          <stop offset="0.55" stopColor="#000" stopOpacity={0.15} />
          <stop offset="1" stopColor="#000" stopOpacity={0.85} />
        </linearGradient>
        <linearGradient id="gk-tie" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1c1d22" />
          <stop offset="0.5" stopColor="#7d786b" />
          <stop offset="0.85" stopColor="#bdb6a4" />
          <stop offset="1" stopColor="#d8d2c0" />
        </linearGradient>
      </defs>

      {/* top of the wrapped head, falling into darkness */}
      <path d="M 90 1920 C 100 1520 300 1210 478 1010 L 602 1010 C 790 1210 990 1520 1000 1920 Z" fill="url(#gk-cloth)" />
      {/* folds converging to the knot */}
      <g fill="none" strokeLinecap="round">
        {[[250, 1920, 492], [400, 1920, 510], [560, 1920, 540], [720, 1920, 570], [880, 1920, 592]].map(([x0, y0, x1], i) => (
          <g key={i}>
            <path d={`M ${x0} ${y0} C ${x0 + (540 - x0) * 0.2} 1500 ${x1 + (x0 - 540) * 0.12} 1150 ${x1} 1020`} stroke="#3c414e" strokeWidth={10 - i} strokeOpacity={0.55} />
            <path d={`M ${x0 + 26} ${y0} C ${x0 + 26 + (540 - x0) * 0.2} 1500 ${x1 + 8 + (x0 - 540) * 0.12} 1150 ${x1 + 8} 1024`} stroke="#ffffff" strokeWidth={4} strokeOpacity={i > 2 ? 0.35 : 0.1} />
          </g>
        ))}
      </g>
      <path d="M 90 1920 C 100 1520 300 1210 478 1010 L 602 1010 C 790 1210 990 1520 1000 1920 Z" fill="url(#gk-down)" />

      {/* gathered neck of cloth under the tie */}
      <path d="M 470 1030 C 498 985 506 950 494 905 L 590 905 C 576 950 584 985 612 1030 Z" fill="url(#gk-cloth)" />
      <g fill="none" stroke="#3c414e" strokeWidth={4} strokeOpacity={0.6}>
        <path d="M 512 1020 C 516 980 514 940 508 910" />
        <path d="M 548 1020 C 548 980 552 940 548 910" />
        <path d="M 580 1020 C 574 980 576 940 576 910" />
      </g>

      {/* twisted column above the tie */}
      <path d="M 500 860 C 488 820 476 790 456 760 L 632 760 C 610 790 596 820 588 860 Z" fill="url(#gk-cloth)" />
      <g fill="none" strokeLinecap="round">
        <path d="M 474 776 C 520 800 560 822 596 850" stroke="#3c414e" strokeWidth={6} strokeOpacity={0.6} />
        <path d="M 490 766 C 540 784 584 800 620 780" stroke="#3c414e" strokeWidth={4} strokeOpacity={0.45} />
        <path d="M 498 846 C 520 830 552 812 600 800" stroke="#f7f4ec" strokeWidth={3} strokeOpacity={0.5} />
      </g>

      {/* gathered tuft: irregular crumpled bunch + one end flopping left, one drooping right */}
      <path d={`M 500 700 C 470 690 ${430 + s} 690 ${396 + s} 712 C ${370 + s} 730 ${362 + s} 760 ${372 + s} 784 C ${382 + s} 804 ${404 + s} 796 ${402 + s} 774 C 404 750 440 738 488 744 Z`} fill="url(#gk-cloth)" />
      <path d={`M 600 744 C 650 744 ${700 + s} 756 ${724 + s} 786 C ${740 + s} 808 ${724 + s} 826 ${706 + s} 808 C 690 788 652 774 610 772 Z`} fill="url(#gk-cloth)" />
      <path d="M 476 772 C 456 740 446 704 458 676 C 444 652 448 622 470 608 C 478 584 504 568 526 576 C 540 552 574 548 594 566 C 620 560 642 578 636 604 C 658 620 660 650 644 670 C 656 700 646 736 616 774 Z" fill="url(#gk-cloth)" />
      <g fill="none" strokeLinecap="round">
        <path d="M 520 768 C 506 720 494 670 498 620" stroke="#262a34" strokeWidth={6} strokeOpacity={0.6} />
        <path d="M 546 770 C 544 720 548 660 560 600" stroke="#3c414e" strokeWidth={4} strokeOpacity={0.55} />
        <path d="M 576 770 C 590 720 604 680 612 640" stroke="#3c414e" strokeWidth={4} strokeOpacity={0.5} />
        <path d="M 488 740 C 476 714 472 690 480 670" stroke="#262a34" strokeWidth={4} strokeOpacity={0.6} />
        <path d="M 470 608 C 490 616 504 612 526 576" stroke="#262a34" strokeWidth={3} strokeOpacity={0.55} />
        <path d="M 594 566 C 600 590 612 600 636 604" stroke="#3c414e" strokeWidth={3} strokeOpacity={0.5} />
        <path d={`M ${396 + s} 712 C 420 720 450 728 488 744`} stroke="#262a34" strokeWidth={4} strokeOpacity={0.5} />
        <path d="M 620 650 C 628 680 626 710 610 740" stroke="#ffffff" strokeWidth={3} strokeOpacity={0.45} />
      </g>

      {/* cloth tie: three wraps + small knot with two hanging tails */}
      {[862, 888, 914].map((y, i) => (
        <g key={y}>
          <path d={`M ${492 - i * 2} ${y - 10} Q 541 ${y + 6} ${592 + i * 2} ${y - 10} L ${594 + i * 2} ${y + 14} Q 541 ${y + 32} ${490 - i * 2} ${y + 14} Z`} fill="url(#gk-tie)" />
          <path d={`M ${490 - i * 2} ${y + 14} Q 541 ${y + 32} ${594 + i * 2} ${y + 14}`} fill="none" stroke="#0b0c10" strokeWidth={3} />
        </g>
      ))}
      <path d={`M 586 900 C 600 930 ${602 + s * 0.4} 980 ${592 + s * 0.6} 1040 L ${614 + s * 0.6} 1036 C ${620 + s * 0.4} 980 616 930 604 896 Z`} fill="url(#gk-tie)" />
      <path d={`M 572 902 C 566 940 ${560 + s * 0.4} 990 ${566 + s * 0.6} 1050 L ${584 + s * 0.6} 1052 C ${580 + s * 0.4} 990 584 940 588 904 Z`} fill="url(#gk-tie)" />
      <ellipse cx={590} cy={894} rx={24} ry={20} fill="url(#gk-tie)" />
      <path d="M 572 886 C 584 878 600 880 608 892" fill="none" stroke="#0b0c10" strokeWidth={3} />

      {/* rim light from the right */}
      <g fill="none" stroke="#e8f0ff" strokeLinecap="round">
        <path d="M 602 1010 C 790 1210 990 1520 1000 1920" strokeWidth={5} strokeOpacity={0.85} />
        <path d="M 590 905 C 576 950 584 985 612 1030" strokeWidth={3} strokeOpacity={0.7} />
        <path d="M 632 760 C 610 790 596 820 588 860" strokeWidth={3} strokeOpacity={0.7} />
        <path d={`M 610 772 C 652 774 690 788 ${706 + s} 808 M ${600} 744 C 650 744 ${700 + s} 756 ${724 + s} 786 C ${740 + s} 808 ${724 + s} 826 ${706 + s} 808`} strokeWidth={3.5} strokeOpacity={0.85} />
        <path d="M 594 566 C 620 560 642 578 636 604 C 658 620 660 650 644 670 C 656 700 646 736 616 774" strokeWidth={3.5} strokeOpacity={0.85} />
        <path d="M 526 576 C 540 552 574 548 594 566" strokeWidth={2.5} strokeOpacity={0.55} />
        <path d="M 598 894 C 606 900 612 912 612 930" strokeWidth={2.5} strokeOpacity={0.8} />
      </g>
    </g>
  );
};
